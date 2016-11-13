"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser   = require('../src/helper/xml-parser'),
    promise     = require('../src/helper/promise'),
    config      = require('../src/tomcat/config'),
    fs 			    = require('fs'),
    descriptor  = require('../src/tomcat/servlet/descriptor'),
    readFileContent = require("ssh-utils").readFileContent;

function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null,
    "config"    : null
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){

    if(tomcatProperties.success) {
      scanResult.properties = {
        "success" : true,
        "value" : tomcatProperties.value
      };
    } else {
      scanResult.properties = {
        "success" : false,
        "error" : tomcatProperties.error,
        "value" : null,
      };
    }
    //scanResult.properties = tomcatProperties;
    return readFile.readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(tcConfigFile){
    var context = [];
    scanResult.config = tcConfigFile.value;
      var configDOM = xmlParser.parse(tcConfigFile.value, xmlEntities);
      if( configDOM.success) {
        context = config.getAllContext(configDOM.document);
        scanResult.config.context  = {
          "success" : true,
          "value" : context
        };
      } else {
        scanResult.config.context  = {
          "success" : false,
          "error" : configDOM.error
        };
    }
    return context;
  })
  .then(function(context){
    return config.getIndividualContextList(conn, installDir + '/conf/Catalina/localhost', xmlEntities);
  })
  .then(function(context){
      var descriptorLoadTasks = context.map(function(aContext){
        var  descFilePath = aContext.docBase.concat('/WEB-INF/web.xml');
        return function(){
          return readFileContent(conn, descFilePath)
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
    fs.writeFileSync(__dirname + '/result.json',JSON.stringify(result), 'utf-8');
    return scanResult;
  })
  /*
  .fail(function(err){
    console.error("error !");
    console.error(err);
  })
  */;
}

exports.scanTomcat = scanTomcat;
