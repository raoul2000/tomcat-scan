"use strict";

var tcProperties = require('../src/tomcat/properties'),
		fs 			  = require('fs'),
	  assert  	= require('chai').assert;


var config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" ));
var connection = config.sshConnection;

describe('Tomcat properties',function(done){
	this.timeout(5000);

	it('fails to get tomcat properties',function(done){

		return tcProperties.extractTomcatProperties(connection, config.home + "/tomcat-1")
		.then(function(result){
			assert.isFalse(result.properties.success);
			assert.equal(result.installDir, config.home + "/tomcat-1");
			assert.isTrue(result.properties.error !== undefined);
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});
});
