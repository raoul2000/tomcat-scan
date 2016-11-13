"use strict";

var context = require('../src/tomcat/context'),
    xmlParser = require('../src/helper/xml-parser'),
    fs = require('fs'),
    assert = require('chai').assert;

var cfg = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8"));

var folderPath = cfg.home + '/tomcat-1/conf/Catalina/localhost';
return context.getContextsFromFolder(cfg.sshConnection, folderPath, {
        HOME: "/home/folder"
    })
    .then(function(result) {
        console.log(result);
    })
    .done(null, function(err) {});
