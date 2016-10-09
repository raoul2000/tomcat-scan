"use strict";

var config  	= require('../src/tomcat/config'),
	  xmlParser = require('../src/helper/xml-parser'),
		fs 			  = require('fs'),
	  assert  	= require('chai').assert;

describe('Tomcat config',function(done){

	it('extract tomcat context from config DOM',function(done){

		var domConfig = xmlParser.parse(
			"<doc>" +
				"<Context path=\"path1\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context path=\"path2\" docBase=\"docBaseValue_2\">\n</Context>"+
			"</doc>"
		);
		assert.isTrue(domConfig.success);


		var result = config.getAllContext(domConfig.document);
		//console.log(result);
		assert.isTrue(result[0].path == "path1");
		assert.isTrue(result[1].path == "path2");

		assert.isTrue(result[0].docBase == "docBaseValue_1");
		assert.isTrue(result[1].docBase == "docBaseValue_2");

		assert.lengthOf(result,2);
		done();
	});
});
