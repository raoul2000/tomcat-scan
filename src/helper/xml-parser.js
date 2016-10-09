"use strict";

var DOMParser      = require('xmldom').DOMParser;

/**
 * Replace XML entities with their values based on the dictionary hash. When an entity is not
 * found in dictionary, the errorHandler function is called with the name of the unresolved entity as
 * argument.
 *
 * Dictionary hash Example :
 * {
 * 		'ENTITY_1' : 'value entity1',
 * 		'ENTITY_2' : 'another value'
 * }
 */
function entityResolver (str, dictionary, errorHandler){
	var reEntity = /&([0-9a-zA-Z_]+);/g;
	var defaultEntity = {
		"quot" : "ENT_QUOT"
	};
	return str
		.split('\n')
		.map(
			function(line) {
				var resultLine  = line,
				    entityValue = '',
				    entityName  = '',
				    match;

				while ( (match = reEntity.exec(line) )) {
					entityName  = match[1];
					if( dictionary.hasOwnProperty(entityName) === false) {
						entityValue = defaultEntity.hasOwnProperty(entityName) ?
								defaultEntity[entityName]
							: errorHandler(entityName);
					} else {
						entityValue = dictionary[entityName];
					}

					resultLine = resultLine.replace(
						new RegExp('&'+entityName+';', 'g'),
						entityValue
					);
				}
				return resultLine;
			}
		)
		.join("\n");
}
exports.entityResolver = entityResolver;

/**
 * Parse an XML string that contains no entity and returns a result object
 * @param  {string} strXML The XML string to parse
 * @return {object}        (see description)
 */
function parseNoEntities(strXML) {
  try {
    var parseErrors = {
      "warning" : [],
      "error" : [],
      "fatal" : []
    };

    var dom = new DOMParser({
      errorHandler:{
        warning   : function(w){ parseErrors.warning.push(w); },
        error     : function(w){ parseErrors.error.push(w);   },
        fatalError: function(w){ parseErrors.fatal.push(w);   }
      }
    }).parseFromString(strXML);

    // consider both error and fatal as severe : no DOM is returned in this case
    if(parseErrors.fatal.length !== 0 || parseErrors.error.length !== 0 ) {
      throw new Error("".concat(
        parseErrors.error.join("\n"),
        parseErrors.fatal.join("\n")
      ));
    }
    return {
      "document"   : dom,
      "success"    : true
    };
  } catch (e) {
    return {
      "document"   : null,
      "success"    : false,
      "error"      : e
    };
  }
}

/**
 * Parse and returns a Document from the XML string passed as argument.
 * If the XML string contains entities, they are resolved priori to parse
 * using the "entities" hash map.
 * In case of success, this function returns :
 * {
 * 	"document" : <the DOM>,
 * 	"success"  : true
 * }
 * In case of error :
 * {
 * 	"document" : null,
 * 	"success"  : false,
 * 	"error"    : {}
 * }
 *
 * @param  {string} strXML   the XML string to parse
 * @param  {object} entities hash where key are entity name and value is entity value
 * @param  {function} entityResolverErrorHandler entity resolution error handler
 * @return {object}          the result of the parse as an object.
 */
function parse( strXML , entities, entityResolverErrorHandler) {

    var result = {
      "document": null,
      "success" : true
    };

    if( entities ) {
      var missingEntities = {}; // use only by private error handler

      // prepare Entity Resolver Error Handler
      var entErrorHandler, isPrivateErrorHandler;
      if(typeof entityResolverErrorHandler === "function" ) {
        isPrivateErrorHandler = false;
        entErrorHandler = entityResolverErrorHandler;
      } else {
        isPrivateErrorHandler = true;
        entErrorHandler = function(missingEntityName){
          missingEntities[missingEntityName] = true;
        };
      }

      // Performing entity resolution. If a custom error handkler has been
      // provided, it may throw an exception to stop the parse process.
      //
      try {
        strXML = entityResolver(strXML, entities, entErrorHandler);
      } catch (e) {
        result.success = false;
        result.error = e;
      }

      if( isPrivateErrorHandler && Object.keys(missingEntities).length !== 0) {
        // there are unresolved entities !!
        result.success = false;
        result.error = { "message" : "missing entities : " + Object.keys(missingEntities).join(',') };
      }
    }

    if(result.success === true) {
      result = parseNoEntities(strXML);
    }
    return result;
}

exports.parse = parse;
