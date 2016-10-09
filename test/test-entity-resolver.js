"use strict";

var resolver = require('../src/helper/xml-parser').entityResolver,
	assert = require('chai').assert;

describe('entity resolver',function(done){

	it('replace entities with their values',function(done){
		var result = resolver(
			"<a>&HOME;</a>",
			{
				"HOME" : "my home"
			},
			function(err) {
				console.error(err);
			}
		);
		assert.equal(result,'<a>my home</a>');
		done();
	});

	it('replace multiple entities with their values',function(done){
		var result = resolver(
			"<a>&HOME;</a><a>&COLOR;</a><a>&HOME;</a>",
			{
				"HOME"  : "my home",
				"COLOR" : "red"
			},
			function(err) {
				console.error(err);
			}
		);
		assert.equal(result,'<a>my home</a><a>red</a><a>my home</a>');
		done();
	});

	it('replaces multiple entities by their value',function(done){
		var result = resolver(
			'blue = &BLUE; red = &RED;, green = &GREEN;',
			{
				'BLUE' : "bleu",
				'RED'  : 'rouge',
				'GREEN' : 'vert'
			},
			function(){ console.log('error');}
		);
		assert.equal(result,"blue = bleu red = rouge, green = vert");
		done();
	});

	it('replace multiple entities with their values in a multi line text',function(done){
		var result = resolver(
			"<a>&HOME;</a><a>&COLOR;</a><a>&HOME;</a>\n"+
			"<a>&COLOR;</a><a>&HOME;</a><a>&COLOR;</a>",
			{
				"HOME"  : "my home",
				"COLOR" : "red"
			},
			function(err) {
				console.error(err);
			}
		);
		assert.equal(result,'<a>my home</a><a>red</a><a>my home</a>\n<a>red</a><a>my home</a><a>red</a>');
		done();
	});

	it('fails when no string is passed', function(done){
		var exceptionThrown = false;
		try {
			resolver(null, {}, console.log);
		} catch (e) {
			exceptionThrown = true;
		}
		assert.ok(exceptionThrown);
		done();
	});
});
