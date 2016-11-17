"use strict";

var xmlParser = require('../src/helper/xml-parser'),
		assert = require('chai').assert;

describe('XML Parser',function(done){

	it('throws exception if the XML is not well formed',function(done){
		try {
			var result = xmlParser.parse(
				"<doc>" +
				"Context >value</Context>"+
				"</doc>",
				{
					"ENTITY_1" : "value1"
				}
			);
			assert.isTrue(false);
		} catch (err) {
			done();
		}
	});
});
