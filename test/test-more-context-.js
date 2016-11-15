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


	it('reads from tomcat install folder',function(done){
		var folderPath = cfg.home + '/tomcat-1';
		return context.getContextsFromTomcatDir(cfg.sshConnection,folderPath,{
			"HOME" : "/home/folder"
		})
		.then(function(result){
			console.log(result);
			assert.equal(result.file, folderPath);
			assert.isArray(result.contexts);
			assert.lengthOf(result.contexts, 1);

			assert.equal(result.contexts[0].path, '/www-C');
			assert.equal(result.contexts[0].docBase , '/home/folder/webapp-C');
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

});
