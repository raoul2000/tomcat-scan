"use strict";

var xmlParser = require('../src/helper/xml-parser'),
		assert = require('chai').assert;

describe('XML Parser',function(done){

	it('resolve entities and parses an XML ',function(done){

		var result = xmlParser.parse(
			"<doc>" +
				"<Context path=\"&ENTITY_1;\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context >&ENTITY_2;</Context>"+
			"</doc>",
			{
				"ENTITY_1" : "value1",
				"ENTITY_2" : "value2"
			}
		);

		assert.isNotNull(result);
		assert.isObject(result);
		assert.isNotNull(result.document);
		assert.isObject(result.document);
		assert.isTrue(result.success);
		done();
	});

	it('returns error if there is unresolved entities',function(done){

		var result = xmlParser.parse(
			"<doc>" +
				"<Context path=\"&ENTITY_1;\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context >&ENTITY_2;</Context>"+
			"</doc>",
			{
				"ENTITY_1" : "value1"
			}
		);

		assert.isNotNull(result);
		assert.isObject(result);
		assert.isFalse(result.success);
		assert.isNull(result.document);
		assert.isObject(result.error);
		assert.propertyVal(result.error, 'message', 'missing entities : ENTITY_2');
		done();
	});

	it('unresolved entities are ignored by a user provided error handler',function(done){

		var result = xmlParser.parse(
			"<doc>" +
				"<Context path=\"&ENTITY_1;\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context >&ENTITY_2;</Context>"+
			"</doc>",
			{
				"ENTITY_1" : "value1"
			},
			function(entityName){
				// ignore any unresolved entities
			}
		);

		assert.isNotNull(result);
		assert.isObject(result);
		assert.isTrue(result.success);
		assert.isNotNull(result.document);
		done();
	});

	it('returns error if the XML is not well formed',function(done){

		var result = xmlParser.parse(
			"<doc>" +
				"Context >value</Context>"+
			"</doc>"
		);

		assert.isNotNull(result);
		assert.isObject(result);
		assert.isFalse(result.success);
		assert.isNull(result.document);
		assert.isNotNull(result.error);
		done();
	});
});
