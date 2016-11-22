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
});
