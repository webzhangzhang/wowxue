'use strict'
const Zip = window.zip
const PromiseLib = require('exceljs/dist/es5/utils/promise')
const RelType = require('exceljs/dist/es5/xlsx/rel-type')
const StylesXform = require('exceljs/dist/es5/xlsx/xform/style/styles-xform')
const SharedStrings = require('exceljs/dist/es5/utils/shared-strings')
const DefinedNames = require('exceljs/dist/es5/doc/defined-names')
const CoreXform = require('exceljs/dist/es5/xlsx/xform/core/core-xform')
const RelationshipsXform = require('exceljs/dist/es5/xlsx/xform/core/relationships-xform')
const ContentTypesXform = require('exceljs/dist/es5/xlsx/xform/core/content-types-xform')
const AppXform = require('exceljs/dist/es5/xlsx/xform/core/app-xform')
const WorkbookXform = require('exceljs/dist/es5/xlsx/xform/book/workbook-xform')
const SharedStringsXform = require('exceljs/dist/es5/xlsx/xform/strings/shared-strings-xform')
const WorksheetWriter = require('exceljs/dist/es5/stream/xlsx/worksheet-writer')
const theme1Xml = require('exceljs/dist/es5/xlsx/xml/theme1.js')

const WorkbookWriter = function(options) {
  options = options || {
    useStyles: true,
    useSharedStrings: true
  }
  this.created = options.created || new Date()
  this.modified = options.modified || this.created
  this.creator = options.creator || 'ExcelJS'
  this.lastModifiedBy = options.lastModifiedBy || 'ExcelJS'
  this.lastPrinted = options.lastPrinted

  // using shared strings creates a smaller xlsx file but may use more memory
  this.useSharedStrings = options.useSharedStrings || false
  this.sharedStrings = new SharedStrings()

  // style manager
  this.styles = options.useStyles ? new StylesXform(true) : new StylesXform.Mock(true)

  // defined names
  this._definedNames = new DefinedNames()

  this._worksheets = []
  this.views = []

  this.media = []

  return new Promise(((resolve, reject) => {
    const that = this
    Zip.createWriter(
      new Zip.BlobWriter(),
      function(writer) {
        that.zip = writer
        //   writer.add('xl/', false, () => {}, () => {});
        //   writer.add('xl/theme/', false, () => {}, () => {});
        //   writer.add('xl/worksheets/', false, () => {}, () => {});
        //   writer.add('xl/_rels/', false, () => {}, () => {});
        //   writer.add('_rels/', false, () => {}, () => {});
        //   writer.add('docProps/', false, () => {}, () => {});
        // these bits can be added right now
        that.promise = PromiseLib.Promise.all([that.addThemes(), that.addOfficeRels()])
        resolve(that)
      },
      reject
    )
  }))
}

WorkbookWriter.prototype = {
  get definedNames() {
    return this._definedNames
  },

  _openStream(path) {
    const self = this
    const stream = new Zip.Stream()
    if (path.indexOf('/') === 0)
      path = path.substr(1)
    self.zip.add(path, stream, () => {
    })
    return stream
  },
  _commitWorksheets() {
    const commitWorksheet = function(worksheet) {
      if (!worksheet.committed) {
        return new PromiseLib.Promise(resolve => {
          worksheet.stream.on('zipped', () => {
            resolve()
          })
          worksheet.commit()
        })
      }
      return PromiseLib.Promise.resolve()
    }
    // if there are any uncommitted worksheets, commit them now and wait
    const promises = this._worksheets.map(commitWorksheet)
    if (promises.length) {
      return PromiseLib.Promise.all(promises)
    }
    return PromiseLib.Promise.resolve()
  },

  commit() {
    // commit all worksheets, then add suplimentary files
    return this.promise
      .then(() => this._commitWorksheets())
      .then(() =>
        PromiseLib.Promise.all([this.addContentTypes(), this.addApp(), this.addCore(), this.addSharedStrings(), this.addStyles(), this.addWorkbookRels()])
      )
      .then(() => this.addWorkbook())
      .then(() => this._finalize())
  },
  get nextId() {
    // find the next unique spot to add worksheet
    let i
    for (i = 1; i < this._worksheets.length; i++) {
      if (!this._worksheets[i]) {
        return i
      }
    }
    return this._worksheets.length || 1
  },
  addWorksheet(name, options) {
    // it's possible to add a worksheet with different than default
    // shared string handling
    // in fact, it's even possible to switch it mid-sheet
    options = options || {}
    const useSharedStrings = options.useSharedStrings !== undefined ? options.useSharedStrings : this.useSharedStrings

    if (options.tabColor) {
      // eslint-disable-next-line no-console
      console.trace('tabColor option has moved to { properties: tabColor: {...} }')
      options.properties = Object.assign(
        {
          tabColor: options.tabColor,
        },
        options.properties
      )
    }

    const id = this.nextId
    name = name || `sheet${id}`

    const worksheet = new WorksheetWriter({
      id,
      name,
      workbook: this,
      useSharedStrings,
      properties: options.properties,
      state: options.state,
      pageSetup: options.pageSetup,
      views: options.views,
      autoFilter: options.autoFilter,
    })

    this._worksheets[id] = worksheet
    return worksheet
  },
  getWorksheet(id) {
    if (id === undefined) {
      return this._worksheets.find(() => true)
    }
    if (typeof id === 'number') {
      return this._worksheets[id]
    }
    if (typeof id === 'string') {
      return this._worksheets.find(worksheet => worksheet && worksheet.name === id)
    }
    return undefined
  },
  addStyles() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      self.addZip(self.styles.xml, 'xl/styles.xml', resolve)
    })
  },
  addThemes() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      self.addZip(theme1Xml, 'xl/theme/theme1.xml', resolve)
    })
  },
  addOfficeRels() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      const xform = new RelationshipsXform()
      const xml = xform.toXml([
        {Id: 'rId1', Type: RelType.OfficeDocument, Target: 'xl/workbook.xml'},
        {Id: 'rId2', Type: RelType.CoreProperties, Target: 'docProps/core.xml'},
        {Id: 'rId3', Type: RelType.ExtenderProperties, Target: 'docProps/app.xml'},
      ])
      self.addZip(xml, '_rels/.rels', resolve)
    })
  },

  addContentTypes() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      const model = {
        worksheets: this._worksheets.filter(Boolean),
        sharedStrings: this.sharedStrings,
      }
      const xform = new ContentTypesXform()
      const xml = xform.toXml(model)
      self.addZip(xml, '[Content_Types].xml', resolve)
    })
  },
  addApp() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      const model = {
        worksheets: this._worksheets.filter(Boolean),
      }
      const xform = new AppXform()
      const xml = xform.toXml(model)
      self.addZip(xml, 'docProps/app.xml', resolve)
    })
  },
  addCore() {
    const self = this
    return new PromiseLib.Promise(resolve => {
      const coreXform = new CoreXform()
      const xml = coreXform.toXml(self)
      self.addZip(xml, 'docProps/core.xml', resolve)
    })
  },
  addSharedStrings() {
    const self = this
    if (this.sharedStrings.count) {
      return new PromiseLib.Promise(resolve => {
        const sharedStringsXform = new SharedStringsXform()
        const xml = sharedStringsXform.toXml(self.sharedStrings)
        self.addZip(xml, 'xl/sharedStrings.xml', resolve)
      })
    }
    return PromiseLib.Promise.resolve()
  },
  addWorkbookRels() {
    const self = this
    let count = 1
    const relationships = [
      {Id: `rId${count++}`, Type: RelType.Styles, Target: 'styles.xml'},
      {Id: `rId${count++}`, Type: RelType.Theme, Target: 'theme/theme1.xml'},
    ]
    if (this.sharedStrings.count) {
      relationships.push({Id: `rId${count++}`, Type: RelType.SharedStrings, Target: 'sharedStrings.xml'})
    }
    this._worksheets.forEach(worksheet => {
      if (worksheet) {
        worksheet.rId = `rId${count++}`
        relationships.push({
          Id: worksheet.rId,
          Type: RelType.Worksheet,
          Target: `worksheets/sheet${worksheet.id}.xml`
        })
      }
    })
    return new PromiseLib.Promise(resolve => {
      const xform = new RelationshipsXform()
      const xml = xform.toXml(relationships)
      self.addZip(xml, 'xl/_rels/workbook.xml.rels', resolve)
    })
  },
  addWorkbook() {
    const self = this
    const model = {
      worksheets: this._worksheets.filter(Boolean),
      definedNames: this._definedNames.model,
      views: this.views,
      properties: {},
    }

    return new PromiseLib.Promise(resolve => {
      const xform = new WorkbookXform()
      xform.prepare(model)
      self.addZip(xform.toXml(model), 'xl/workbook.xml', resolve)
    })
  },
  _finalize() {
    const self = this
    return new PromiseLib.Promise((resolve) => {
      self.zip.close(function(blob) {
        resolve(blob)
      })
    })
  },
  addZip(content, name, onend) {
    const stream = new Zip.Stream()
    stream.write(content)
    stream.end()
    this.zip.add(name, stream, () => {
      onend()
    })
  }
}

export default WorkbookWriter
