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
		var contexts = result.getElementsByTagName("Context");
		assert.lengthOf(contexts,  2);
		assert.equal(contexts[0].getAttribute('path'), 'value1');
		assert.equal(contexts[0].getAttribute('docBase'), 'docBaseValue_1');
		assert.equal(contexts[1].textContent,'value2');

		done();
	});

	it('throws exception if there is unresolved entities',function(done){

		try {
			var result = xmlParser.parse(
				"<doc>" +
				"<Context path=\"&ENTITY_1;\" docBase=\"docBaseValue_1\">\n</Context>"+
				"<Context >&ENTITY_2;</Context>"+
				"</doc>",
				{
					"ENTITY_1" : "value1"
				}
			);
			assert.fail();
		} catch (err) {
			assert.equal(err.message,  'missing entities : ENTITY_2');
			done();
		}
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
		var contexts = result.getElementsByTagName("Context");
		assert.lengthOf(contexts,  2);
		assert.equal(contexts[0].getAttribute('path'), 'value1');
		assert.isUndefined(contexts[1].text);

		done();
	});

	it('throws exception if the XML is not well formed',function(done){
		try {
			var result = xmlParser.parse(
				"<doc>" +
				"Context >value</Context>"+
				"</doc>"
			);
			assert.isTrue(false);
		} catch (err) {
			done();
		}
	});
});
