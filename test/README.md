
## Notes

To run these tests you must have a SSH server available. To configure SSH for Windows 10/Ubuntu sub system see http://superuser.com/questions/1111591/how-can-i-ssh-into-bash-on-ubuntu-on-windows-10

Start SSH :
```
> sudo service ssh --full-restart
```

List service :

```
> sudo service --status-all
```


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
