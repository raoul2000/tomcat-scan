"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser   = require('../src/helper/xml-parser'),
    promise     = require('../src/helper/promise'),
    context     = require('../src/tomcat/context'),
    config      = require('../src/tomcat/config'),
    fs 			    = require('fs'),
    Q 			    = require('q'),
    descriptor  = require('../src/tomcat/servlet/descriptor'),
    readFileContent = require("ssh-utils").readFileContent;

function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null,
    "config"    : null
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){
    console.log("properties");

    if(tomcatProperties.success) {
      scanResult.properties = {
        "success" : true,
        "value"   : tomcatProperties.value
      };
    } else {
      scanResult.properties = {
        "success" : false,
        "error"   : tomcatProperties.error,
        "value"   : null,
      };
    }
    //scanResult.properties = tomcatProperties;
    return true;
    //return readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(result){

    return config.getDOM(conn, installDir, xmlEntities)
    .then(function(configDOM){
      scanResult.configDOM = configDOM;
      scanResult.port = config.getPortNumber(configDOM);
      //context.getContextsFromDOM(configDOM);
      return true;
    });
  })
  .then(function(result){
    return context.getContextsFromFolder(conn,installDir+"/conf/Catalina/localhost", xmlEntities);
  })
  .then(function(contextList){
    console.log(contextList);
    contextList.forEach(function(aContext){
      console.log(
          "file          : " + aContext.file +
        "\ncontext found : " + aContext.contexts.length + "\n"
      );
    });

    var descriptorLoadTasks = [];
    contextList.forEach(function(item){
      item.contexts.map(function(context){
        var descriptorFilePath = context.docBase.concat('/WEB-INF/web.xml');

        descriptorLoadTasks.push(
          function(){
            console.log("loading file "+descriptorFilePath);
            return readFileContent(conn, descriptorFilePath);
          }
        );

      });
    });
    return promise.allSettledInSequence(descriptorLoadTasks);
  })
  .then(function(descriptorList){
    descriptorList.forEach(function(item){
      if(item.success === true ){
        try {
          var dom = xmlParser.parse(item.value, xmlEntities);
          item.servlets = descriptor.getAllServlet(dom);
        } catch (err) {
          item.servlet = {"error" : err};
        }
      }
    });
    return descriptorList;
  })
  .then(function(result){
    //fs.writeFileSync(__dirname + '/scanResult.json',JSON.stringify(scanResult), 'utf-8');
    scanResult.configDOM = null;
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
