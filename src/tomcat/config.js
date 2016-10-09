"use strict";

/**
 * Extract context informations from a tomcat server configuration XML string passed as argument.
 * Note that the XML string must NOT contain unresolved entities.
 * This function returns an array of object describing the @path and @docBase attributes.
 * Example :
 * [
 * 	{'path':'/path, 'docBase' : '/doc/base/path'},
 * 	{'path':'/path, 'docBase' : '/doc/base/path'}
 * ]
 *
 * @param  {dom} Document
 * @return {array}      list of contexts
 */
function getAllContext(dom) {
  return dom.getElementsByTagName("Context").map(function(aContext,idx){
    return {
      'path'   : aContext.getAttribute('path'),
      'docBase': aContext.getAttribute('docBase')
    };
  });
}
exports.getAllContext = getAllContext;
