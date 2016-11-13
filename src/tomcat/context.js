"use strict";

var promise   = require('../helper/promise'),
    xmlParser = require('../helper/xml-parser'),
    sshUtils  = require("ssh-utils");


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
function getContextsFromDOM(dom) {

  var contexts = [];
  var contextList = dom.getElementsByTagName("Context");
  for(var i=0; i<contextList.length; i ++) {
    contexts.push({
      'path'    : contextList[i].getAttribute('path'),
      'docBase' : contextList[i].getAttribute('docBase')
    });
  }
  return contexts;
}
exports.getContextsFromDOM = getContextsFromDOM;

/**
 * Create a list of context from a file.
 *
 * @param  {object} conn        connection settings
 * @param  {string} filePath    absolute path to the file to analyze
 * @param  {object} xmlEntities hash where keys  are entities names and value are entity values
 * @return {object}             Promisifies result
 */
function getContextsFromFile(conn, filePath, xmlEntities) {

  // -----------------
  var parseFileContent = function(fileContent) {
    if( fileContent.success === false) {
      throw new Error("failed  to read file content");
    }

    var dom = xmlParser.parse(fileContent.value, xmlEntities);
    if(dom.success) {
      return dom;
    } else {
      throw dom.error;
    }
  };

  var callGetContextsFromDOM = function(dom) {
    return  getContextsFromDOM(dom.document);
  };
  // ===================
  return sshUtils.readFileContent(conn,filePath)
  .then(parseFileContent)
  .then(callGetContextsFromDOM);
}
exports.getContextsFromFile = getContextsFromFile;

/**
 * Load context from files located in a folder.
 *
 * @param  {object} conn        connection settings
 * @param  {string} filePath    absolute path to the file to analyze
 * @param  {object} xmlEntities hash where keys  are entities names and value are entity values
 * @return {object}             Promisifies result
 */
function getContextsFromFolder(conn, folderPath, xmlEntities) {

  return sshUtils.exec.command(conn, "ls "+folderPath+"/*.xml")
  .then(function(lsOutput){
    var tasks = lsOutput.value
    .split('\n')
    .filter(function(filePath){
      return filePath.length  !== 0;
    })
    .map(function(filePath){
      return function() {
        console.log("reading "+filePath);
        return getContextsFromFile(conn, filePath, xmlEntities);
      };
    });
    return promise.allSettledInSequence(tasks);
  });
}

exports.getContextsFromFolder = getContextsFromFolder;
