"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser = require('../src/helper/xml-parser'),
    readFile = require("ssh-utils").readFile;

function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){
    scanResult.properties = tomcatProperties;
    return readFile.readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(configFileContent){
    var configDOM =
  });
}

exports.scanTomcat = scanTomcat;
