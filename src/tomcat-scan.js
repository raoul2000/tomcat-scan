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
    "config"    : null,
    "contexts"  : []
  };

  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(function(tomcatProperties){

    console.log("properties");
    scanResult.properties = tomcatProperties;
    return true;
  })
  .fail(function(err){
    console.error("failed to get tomcat properties");
    console.error(err);
    return true;
  })
  .then(function(result){

    return config.getDOM(conn, installDir, xmlEntities)
    .then(function(configDOM){
      scanResult.config = {
        "filepath" : configDOM.filepath,
        "DOM"      : configDOM.DOM
      };
      scanResult.port = config.getPortNumber(configDOM.DOM);
      scanResult.contexts.push({
        "file" : configDOM.filepath,
        "list" : context.getContextsFromDOM(configDOM.DOM)
      });
      return true;
    });
  })
  .then(function(result){

    // TODO: check why a non XML individual context file does not
    // return some error
    return context.getContextsFromFolder(conn,installDir+"/conf/Catalina/localhost", xmlEntities);
  })
  .then(function(contextList){
    console.log(contextList);
    contextList.forEach(function(aContext){
      console.log(
          "file          : " + aContext.file +
        "\ncontext found : " + aContext.list.length + "\n"
      );
    });
    scanResult.contexts = scanResult.contexts.concat(contextList);

    var descriptorLoadTasks = [];
    scanResult.contexts.forEach(function(item){
      item.list.map(function(context){
        var descriptorFilePath = context.docBase.concat('/WEB-INF/web.xml');

        descriptorLoadTasks.push(
          function(){
            var curCtx = context;
            console.log("loading file "+descriptorFilePath);
            return readFileContent(conn, descriptorFilePath)
            .then(function(descrFileContent){
              if(descrFileContent.success === true ){
                try {
                  var dom = xmlParser.parse(descrFileContent.value, xmlEntities);
                  curCtx.servlets = descriptor.getAllServlet(dom);
                } catch (err) {
                  curCtx.servlet = {"error" : err};
                }
              }
            })
            .fail(function(err){
              curCtx.error = err;
            });
          }
        );
      });
    });
    return promise.allSettledInSequence(descriptorLoadTasks);
  })/*
  .then(function(descriptorList){
    descriptorList.forEach(function(item){
    });
    return descriptorList;
  })*/
  .then(function(result){
    //fs.writeFileSync(__dirname + '/scanResult.json',JSON.stringify(scanResult), 'utf-8');
    fs.writeFileSync(__dirname + '/result.json',JSON.stringify(result), 'utf-8');
    return scanResult;
  });
  /*
  .fail(function(err){
    console.error("error !");
    console.error(err);
  })
  */
}

exports.scanTomcat = scanTomcat;
