"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser   = require('../src/helper/xml-parser'),
    promise     = require('../src/helper/promise'),
    config      = require('../src/tomcat/config'),
    descriptor  = require('../src/tomcat/servlet/descriptor'),
    readFile    = require("ssh-utils").readFile;

function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null,
    "context" :  null
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){
    scanResult.properties = tomcatProperties;
    return readFile.readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(configFileContent){
    var context = [];
    if( configFileContent.success ) {
      var configDOM = xmlParser.parse(configFileContent, xmlEntities);
      if( configDOM.success) {
        context = config.getAllContext(configDOM);
        scanResult.context  = {
          "success" : true,
          "value" : context
        };
      } else {
        scanResult.context  = {
          "success" : false,
          "error" : configDOM.error
        };
      }
    }
    return context;
  })
  .then(function(context){
      var descriptorLoadTasks = context.map(function(aContext){
        var  descFilePath = aContext.docBase.concat('/WEB-INF/web.xml');
        return function(){
          return readFile(conn, descFilePath)
          .then(function(descFileContent){
            aContext.descriptor = descFileContent;
            if(aContext.descriptor.success === true) {
              var dom = xmlParser.parse(aContext.descriptor.value, xmlEntities);
              if( dom.success === true ) {
                aContext.descriptor.servlet = descriptor.getAllServlet(dom.document);
              } else {
                aContext.descriptor.servlet = dom.error;
              }
            }
          });
        };
      });
      return promise.allSettledInSequence(descriptorLoadTasks);
  })
  .then(function(result){
    return scanResult;
  });
}

exports.scanTomcat = scanTomcat;
