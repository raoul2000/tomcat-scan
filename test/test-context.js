"use strict";

var context  	= require('../src/tomcat/context'),
	  xmlParser = require('../src/helper/xml-parser'),
		fs 			  = require('fs'),
	  assert  	= require('chai').assert;

var cfg = {};

describe('Tomcat context',function(done){

	this.timeout(10000);

	before(function() {
    cfg = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" ));
  });

	it('extracts tomcat context from config DOM',function(done){

		var domConfig = xmlParser.parse(
			"<doc>" +
				"<Context path=\"path1\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context path=\"path2\" docBase=\"docBaseValue_2\">\n</Context>"+
			"</doc>"
		);
		assert.isObject(domConfig);

		var result = context.getContextsFromDOM(domConfig);
		//console.log(result);

		assert.isArray(result);
		assert.lengthOf(result,2);
		assert.equal(result[0].path, "path1");
		assert.equal(result[1].path, "path2");

		assert.equal(result[0].docBase, "docBaseValue_1");
		assert.equal(result[1].docBase, "docBaseValue_2");

		done();
	});

	it('reads individual contexts from a file',function(done){
		var folderPath = cfg.home + '/tomcat-1/conf/Catalina/localhost/webapp-C.xml';
		return context.getContextsFromFile(cfg.sshConnection,folderPath,{
			"HOME" : "/home/folder"
		})
		.then(function(result){
			//console.log(result);
			assert.equal(result.file, folderPath);
			assert.isArray(result.list);
			assert.lengthOf(result.list, 1);

			assert.equal(result.list[0].path, '/www-C');
			assert.equal(result.list[0].docBase , '/home/folder/webapp-C');
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

	it('returns empty list if the file contains no context',function(done){
		var folderPath = cfg.home + '/tomcat-1/conf/Catalina/localhost/dummy.xml';
		return context.getContextsFromFile(cfg.sshConnection,folderPath,{
			"HOME" : "/home/folder"
		})
		.then(function(result){
			//console.log(result);
			assert.equal(result.file, folderPath);
			assert.isArray(result.list);
			assert.lengthOf(result.list, 0);

			done();
		})
		.done(null, function(err){
			done(err);
		});
	});


	it('reads context from files in a folder', function(done){
		var folderPath = cfg.home + '/tomcat-1/conf/Catalina/localhost';
		return context.getContextsFromFolder(cfg.sshConnection, folderPath, {
			HOME : "/home/folder"
		})
		.then(function(result){
			//console.log(result);
			assert.isArray(result);
			assert.lengthOf(result, 3);

			assert.equal(result[0].file, cfg.home + "/tomcat-1/conf/Catalina/localhost/dummy.xml");
			assert.isArray(result[0].list);
			assert.lengthOf(result[0].list, 0, "should found no context in this file");

			assert.equal(result[1].file, cfg.home + "/tomcat-1/conf/Catalina/localhost/webapp-C.xml");
			assert.isArray(result[1].list);
			assert.lengthOf(result[1].list, 1);

			assert.equal(result[2].file, cfg.home + "/tomcat-1/conf/Catalina/localhost/webapp-D.xml");
			assert.isArray(result[2].list);
			assert.lengthOf(result[2].list, 1);

			done();
		})
		.done(null, function(err){
			done(err);
		});

	});

	it('fails to read individual contexts from an invalid XML file',function(done){
		var folderPath = cfg.home + '/tomcat-1/conf/Catalina/localhost/dummy.xml';
		return context.getContextsFromFile(cfg.sshConnection,folderPath,{
			"HOME" : "/home/folder"
		})
		.then(function(result){
			//console.log(result);
			assert.equal(result.file, folderPath);
			assert.isArray(result.list);
			assert.lengthOf(result.list, 0);
			assert.hasOwnProperty(result, "error");

			done();
		})
		.done(null, function(err){
			console.error(err);
			done(err);
		});
	});

});
