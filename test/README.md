

# Running Tests

## Prerequisite

Prior to run the test, you must set up a SSH server. Two options are described here.

### Using the Ubuntu subsystem from Windows 10

To run these tests you must have a SSH server available. To configure SSH for Windows 10/Ubuntu sub system see http://superuser.com/questions/1111591/how-can-i-ssh-into-bash-on-ubuntu-on-windows-10

Start SSH :
```
> sudo service ssh --full-restart
```

List service :

```
> sudo service --status-all
```

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


### Using a Docker image

Having Docker installed correctly, got to the `./test/sample-data` folder and start the appropriate container:
```
> cd ./test/sample-data
> docker run --rm -v %cd%:/mnt --publish=2222:22 sickp/alpine-sshd:7.5
```

SSH is then reachable at 127.0.0.1:2222. The corresponding `config.json` file is :
```
{
  "sshConnection" : {
    "host" : "127.0.0.1",
    "username" : "root",
    "password" : "root",
    "port" : 2222
  },
  "home" : "/mnt/home"
}
```

### mocha

Install mocha globally. From the main project folder :
```
> npm install mocha -g
```

## Executing tests

From the project main folder run :

```
> mocha test
```
