"use strict";

var tomcatScan  = require('../index.js'),
		fs 			    = require('fs'),
		assert      = require('chai').assert;

var config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" ));
var connection = config.sshConnection;

var entity = {
	'HOME' : config.home,
	"TOMCAT_CORE_SHUTDOWN_PORT" : 111,
	"TOMCAT_CORE_PORT" : 222
};

describe('Scans a configuration for tomcat-1',function(done){
	this.timeout(20000);

	it('scan tomcat config',function(done){
		return tomcatScan.run(connection, config.home + '/tomcat-1',entity)
		.then(function(result){
			result.config.DOM = null; // avoid circular reference when stringify JSON
			fs.writeFileSync(__dirname + '/output/test-main-scanResult.json',JSON.stringify(result), 'utf-8');
			done();
		})
		.fail(function(err){
			console.error(err);
			done(err);
		})
		.done(null,function(err){
			done(err);
		});
	});
});
