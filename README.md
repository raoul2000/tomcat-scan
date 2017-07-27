THIS IS A WORK IN PROGRESS

# Scan for Apache Tomcat

Scan Apache Tomcat installation folder and extract :
- tomcat properties
- port number
- list of contexts
- list of all servlet per context
- URL pattern for each servlet
- and more ...

Example :
```
var tomcatScan  = require('tomcat-scan');

var XMLentity = {
	'HOME' : config.home,
	"TOMCAT_CORE_SHUTDOWN_PORT" : 111,
	"TOMCAT_CORE_PORT" : 222
};

var connection = {
  "host": "127.0.0.1",
  "username": "bobMarley",
  "password" : "rastafary"
};

tomcatScan.run(connection, "/folder/home/tomcat-A", XMLentity)
.then(function(result){
  console.log("result = " + result);
})
.fail(function(error){
  console.error(error);
});
```
