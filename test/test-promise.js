"use strict";

var promise = require('../src/helper/promise'),
		sshExec = require('ssh-utils').exec,
		fs 			= require('fs'),
		assert  = require('chai').assert;

var connection = {};

describe('Util Promise',function(done){
	this.timeout(5000);

	before(function() {
    connection = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8" )).sshConnection;
  });

	it('runs Promised functions in sequence',function(done){

		return promise.allSettledInSequence([
			function() { return sshExec.command(connection,"whoami"); },
			function() { return sshExec.command(connection,"whoami"); },
			function() { return sshExec.command(connection,"whoami"); }
		])
		.then(function(result){
			//console.log(result);

			assert.isArray(result);
			assert.lengthOf(result,3);
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});

	it('fails on bad SSH command',function(done){

		return promise.allSettledInSequence([
			function() { return sshExec.command(connection,"__whoami"); },
			function() { return sshExec.command(connection,"__whoami"); },
			function() { return sshExec.command(connection,"whoami"); }
		])
		.then(function(result){
			//console.log(result);
			assert.isArray(result);
			assert.lengthOf(result,3);
			
			done();
		})
		.done(null,function(err){
			done(err);
		});
	});
});
