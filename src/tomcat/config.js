"use strict";

var promise   = require('../helper/promise'),
    xmlParser = require('../helper/xml-parser'),
    sshUtils  = require("ssh-utils");

function getDOM(conn, tomcatInstallDir, xmlEntities) {
  var tomcatConfigFilePath = tomcatInstallDir + '/conf/server.xml';
  // -----------------
  var parseFileContent = function(fileContent) {
    if( fileContent.success === false) {
      throw new Error("failed  to read file content");
    }
    return xmlParser.parse(fileContent.value, xmlEntities);
  };

  return sshUtils.readFileContent(conn, tomcatConfigFilePath)
  .then(parseFileContent)
  .then(function(dom){
    return dom;
  });
}

exports.getDOM = getDOM;


function getPortNumber(dom) {
/*
  var contexts = [];
  var contextList = dom.getElementsByTagName("Context");
  for(var i=0; i<contextList.length; i ++) {
    contexts.push({
      'path'    : contextList[i].getAttribute('path'),
      'docBase' : contextList[i].getAttribute('docBase')
    });
  }*/
  return 111;
}
exports.getPortNumber = getPortNumber;
