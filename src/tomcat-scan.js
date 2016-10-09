"use strict";

var tomcatProps = require('./tomcat/properties'),
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
    //
  });
}

exports.scanTomcat = scanTomcat;
