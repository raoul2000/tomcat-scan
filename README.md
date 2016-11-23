THIS IS A WORK IN PROGRESS

# tomcat-scan

Scan Tomcat installation folder and extract :
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

## Notes

Configure SSH for ubuntu (Win10 sub system)
http://superuser.com/questions/1111591/how-can-i-ssh-into-bash-on-ubuntu-on-windows-10

Start SSH :
```
> sudo service ssh --full-restart
```

List service :

```
> sudo service --status-all
```

- folder `ui` : web page template to displau tomcat config

# Test

To run test you must have an SSH access configured in `test\config.json`.
Example :

```
{
  "sshConnection" : {
    "host" : "127.0.0.1",
    "username" : "bobMarley",
    "password" : "redemption"
  },
  "home" : "/root/home/tomcat-scan/test/sample-data/home"
}
```
Copy the content of `test/sample-data/home` to your server and configure the **home** parameter to point to it.
