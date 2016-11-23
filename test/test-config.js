"use strict";

var config  	= require('../src/tomcat/config'),
	  xmlParser = require('../src/helper/xml-parser'),
		fs 			  = require('fs'),
	  assert  	= require('chai').assert;

var cfg = {};
var xmlEntities = {
	"HOME" : "/home/folder"
};

describe('Tomcat config',function(done){

	this.timeout(10000);

	before(function() {
    cfg = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" ));
  });

	it('load tomcat config',function(done){

		return config.getDOM(cfg.sshConnection, cfg.home + "/tomcat-1", xmlEntities)
		.then(function(domConfig){
			assert.isObject(domConfig);
			var port = config.getPortNumberByProtocol(domConfig.DOM,"HTTP/1.1");
			assert.equal(port, 8080);
			
			port = config.getPortNumberByProtocol(domConfig.DOM,"NOT_FOUND");
			assert.equal(port, null);
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});

	it('fails to load tomcat config for invalid folder',function(done){

		return config.getDOM(cfg.sshConnection, cfg.home + "/tomcat-NOT_FOUND", xmlEntities)
		.then(function(domConfig){
			done(new Error("tomcat install folder invalid"));
		})
		.fail(function(err){
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});

	it('fails to load tomcat config with undefined entity',function(done){

		return config.getDOM(cfg.sshConnection, cfg.home + "/tomcat-1", {})
		.then(function(domConfig){
			done(new Error("entity missing"));
		})
		.fail(function(err){
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});

});
