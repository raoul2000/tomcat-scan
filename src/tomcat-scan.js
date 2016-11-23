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

/**
 * Scan Tomat configuration.
 *
 * @param  {object} conn        SSH2 option object
 * @param  {string} installDir  folder where the tomcat to scn is installed
 * @param  {object} xmlEntities hash entity name/value used for XML parse
 * @return {object}             Promise result (see scanResult)
 */
function scanTomcat(conn, installDir, xmlEntities) {
  var scanResult = {
    "properties" : null,
    "config"    : null,
    "contexts"  : []
  };

  // get tomcat properties
  var storeTomcatProperties = function(tomcatProperties) {
    scanResult.properties = tomcatProperties;
    return true;
  };

  // analyze the server.xml configuration filr and retrieve :
  // - path
  // - DOM
  // - port number
  // - context list
  var analyzeServerXml = function() {
    return config.getDOM(conn, installDir, xmlEntities)
    .then(function(configDOM){
      scanResult.config = {
        "filepath" : configDOM.filepath,
        "DOM"      : configDOM.DOM
      };
      scanResult.port = config.getPortNumberByProtocol(configDOM.DOM,"HTTP/1.1");
      scanResult.contexts.push({
        "file" : configDOM.filepath,
        "list" : context.getContextsFromDOM(configDOM.DOM)
      });
      return true;
    });
  };

  // extract individual contexts defined in XML files in Catalina/localhost
  var extractContexts = function() {
    return context.getContextsFromFolder(conn,installDir+"/conf/Catalina/localhost", xmlEntities)
    .then(function(contextList){
      scanResult.contexts = scanResult.contexts.concat(contextList);
      return true;
    });
  };

  // for each context, read & Parse the descriptor file and search for
  // servlet
  var extractServlets = function(){

    scanResult.contexts.forEach(function(aContext){
      console.log(
          "file          : " + aContext.file +
        "\ncontext found : " + aContext.list.length + "\n"
      );
    });

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
  };

  // remove the config DOM to avoid circular reference error on object deserialization
  var cleanupResult = function(){
    delete scanResult.config.dom;
    return scanResult;
  };

  ////////////////////////////////////////////////////////////
  /// Main Promise  chain
  ///
  return tomcatProps.extractTomcatProperties(conn,installDir)
  .then(storeTomcatProperties)
  .fail(function(err){
    console.error("failed to get tomcat properties");
    console.error(err);
    return true;
  })
  .then(analyzeServerXml)
  .then(extractContexts)
  .then(extractServlets)
  .then(cleanupResult);
}

exports.scanTomcat = scanTomcat;
