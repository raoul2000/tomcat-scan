"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser   = require('../src/helper/xml-parser'),
    promise     = require('../src/helper/promise'),
    config      = require('../src/tomcat/config'),
    fs 			    = require('fs'),
    descriptor  = require('../src/tomcat/servlet/descriptor'),
    readFile    = require("ssh-utils").readFile;

function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null,
    "context"    : null
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){
    scanResult.properties = tomcatProperties;
    return readFile.readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(tcConfigFile){
    var context = [];
    scanResult.config = tcConfigFile;
    if( tcConfigFile.content.success ) {
      var configDOM = xmlParser.parse(tcConfigFile.content.value, xmlEntities);
      if( configDOM.success) {
        context = config.getAllContext(configDOM.document);
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
          return readFile.readFileContent(conn, descFilePath)
          .then(function(descFileContent){
            aContext.descriptor = descFileContent;
            if(aContext.descriptor.content.success === true) {
              var dom = xmlParser.parse(aContext.descriptor.content.value, xmlEntities);
              if( dom.success === true ) {
                aContext.descriptor.servlet = descriptor.getAllServlet(dom.document);
              } else {
                aContext.descriptor.servlet = dom.error;
              }
            }
            return aContext;
          });
        };
      });
      return promise.allSettledInSequence(descriptorLoadTasks);
  })
  .then(function(result){
    //fs.writeFileSync(__dirname + '/scanResult.json',JSON.stringify(scanResult), 'utf-8');
    //fs.writeFileSync(__dirname + '/result.json',JSON.stringify(result), 'utf-8');
    return scanResult;
  });
}

exports.scanTomcat = scanTomcat;
