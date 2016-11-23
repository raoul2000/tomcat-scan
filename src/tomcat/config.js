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
    return {
      "filepath" : tomcatConfigFilePath,
      "DOM" : xmlParser.parse(fileContent.value, xmlEntities)
    };
  };

  return sshUtils.readFileContent(conn, tomcatConfigFilePath)
  .then(parseFileContent);
}

exports.getDOM = getDOM;


function getPortNumberByProtocol(dom, protocol) {
  var connectorList = dom.getElementsByTagName("Connector");
  for(var i=0; i<connectorList.length; i ++) {
    if( connectorList[i].getAttribute("protocol") === protocol ){
      return connectorList[i].getAttribute("port");
    }
  }
  return null;
}
exports.getPortNumberByProtocol = getPortNumberByProtocol;
