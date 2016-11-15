"use strict";

var tomcatProps = require('./tomcat/properties'),
    xmlParser   = require('../src/helper/xml-parser'),
    promise     = require('../src/helper/promise'),
    context     = require('../src/tomcat/context'),
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
    return true;
    //return readFileContent(conn, installDir+'/conf/server.xml');
  })
  .then(function(result){
    var contextList = [];

    var getContextFromConfig = function() {
      console.log("getContextFromConfig");
      return context.getContextsFromFile(conn, installDir+'/conf/server.xml', xmlEntities)
      .then(function(result){
        contextList.push(result);
        console.log("contect from config returned : ");
        console.log(result);

        console.log("1. contextList now contains "+contextList.length+" items");
      });
    };

    var getIndividualContextList = function() {
      console.log("getIndividualContextList");
      return context.getContextsFromFolder(conn, installDir + '/conf/Catalina/localhost', xmlEntities)
      .then(function(result){
        contextList.concat(result);
        console.log("getIndividualContextList returned : ");
        console.log(result);

        console.log("2. contextList now contains "+contextList.length+" items");

      });
    };

    return Q.fcall(getContextFromConfig)
    .then(getIndividualContextList)
    .then(function(result){
      console.log(contextList);
      return contextList;
    });
  })
  .then(function(context){
    console.log(context);
    var contextList = context;
    contextList.forEach(function(aContext){
      console.log(
          "file          : " + aContext.file +
        "\ncontext found : " + aContext.contexts.length + "\n"
      );
    });
      var descriptorLoadTasks = context.map(function(aContext){
        var  descFilePath = aContext.docBase.concat('/WEB-INF/web.xml');
        return function(){
          return readFileContent(conn, descFilePath)
          .then(function(descFileContent){
            aContext.descriptor = descFileContent;
            if(aContext.descriptor.content.success === true) {
              var dom = xmlParser.parse(aContext.descriptor.content.value, xmlEntities);
              aContext.descriptor.servlet = descriptor.getAllServlet(dom);
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
