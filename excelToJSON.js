var xls = require('excel'),
	fs = require ('fs');

module.exports = function (opt) {

	opt = opt || {
		lang 	: "ko",
		desc 	: "Table of contents",
		excel 	: "sample.xlsx",
		result  : "toc.json"
	};
      
	xls(opt.excel, function(err, excelRawData) {
		if (err) throw err;

		var	toc = {
			"desc" : opt.desc,
			"lang" : opt.lang,
			"chapters" : {}
		};

		var chapters = toc.chapters,
			indexedNodes = {},
			interpreter = {};

		for (var idx=1; idx < excelRawData.length; idx++) {
			var record = {
				"parent" 	: excelRawData[idx][1],
				"label" 	: excelRawData[idx][2],
				"desc"	 	: excelRawData[idx][3]
			};

			indexedNodes[excelRawData[idx][0]] = interpreter[excelRawData[idx][0]] = record;
		}

		for (var key in interpreter) {		
			var record 	= interpreter[key];

			if (record.parent ==="ROOT") {
				//루트가 부모라면 바로 추가.
				chapters[key] = record
			} else {
				// 자식 노드를 추가. call by reference이므로, 노드가 interpreter에 있어도 toc에 동시 업데이트
				if (typeof indexedNodes[record.parent].children === "undefined") {
					indexedNodes[record.parent].children = {};
				}
				indexedNodes[record.parent].children[key] = record;
			}
		}

		fs.writeFile (opt.result, JSON.stringify(toc), function (err) {
			if (err) throw err;
			console.log ("Done");
		});
	});

};