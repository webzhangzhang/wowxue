module.exports = {
	presets: [
		['@vue/app', {loose: true,useBuiltIns: "entry" }]
	],
    plugins:[
        [
            'import',
            {
                "libraryName": "story-ui",
                "style": false,
                "camel2DashComponentName": false
            }
        ]
    ]
}
