# tomcat-scan

Scan Tomcat installation folder and extract settings

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
    "user" : "bobMarley",
    "pass" : "redemption"
  },
  "home" : "/root/home/tomcat-scan/test/sample-data/home"
}
```
Copy the content of `test/sample-data/home` to your server and configure the **home** parameter to point to it.
