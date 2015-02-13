var converter = require("../static-webhelp/excelToJSON.js");

converter({
	lang 	: "en",
	desc 	: "Table of contents english",
	excel 	: "sample.xlsx",
	result  : "toc_en.json"
});