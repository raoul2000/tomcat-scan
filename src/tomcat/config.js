"use strict";
var sshUtils = require("ssh-utils");

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
exports.getAllContext = getAllContext;




function getIndividualContextList(conn, folderPath, xmlEntities) {
  return sshUtils.exec.command(conn, "ls " + folderPath+ "/*.xml")
  .then(function(contextFileList){
    if(contextFileList.success) {
      console.log(contextFileList);
      var processContextTasks = [];
      contextFileList.value.split('\n').forEach(function(contextFilePath){
        processContextTasks.push(
          function(){
          }
        );
      });
    }
  });

}
exports.getIndividualContextList = getIndividualContextList;
