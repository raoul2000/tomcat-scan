"use strict";

var tc = require('../src/tomcat-scan.js'),
		fs 			= require('fs'),
		assert  = require('chai').assert;

var config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" ));
var connection = config.sshConnection;
var entity = {
	'HOME' : config.home
};


describe('Scans a configuration for tomcat-1',function(done){
	this.timeout(5000);

	it('scan tomcat config',function(done){
		return tc.scanTomcat(connection, config.home + '/tomcat-1',entity)
		.then(function(result){
			console.log(result);
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});
});
