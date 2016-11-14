"use strict";

var scanTomcat  = require('./src/tomcat-scan').scanTomcat,
    fs 			    = require('fs');

function main() {
  var connection = {
    "host" : "10.25.7.131",
    "username" : "meth01",
    "password" : "meth01"
  };


  return scanTomcat(connection, '/methode/meth01/tomcat-pub',{})
  .then(function(result){
    //console.log(result);
    fs.writeFileSync(__dirname + '/test/output/test-main-scanResult.json',JSON.stringify(result), 'utf-8');
  })
  .done(null,function(err){
    console.error("ERROR!");
    console.error(err);
  });
}

main();
