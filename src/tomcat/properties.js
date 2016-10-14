"use strict";

var Q        = require('q'),
    sshUtils = require("ssh-utils");

/**
 *
 * Expected SSH command output :
 *
 * Server version: Apache Tomcat/6.0.36
 * Server built:   Oct 16 2012 09:59:09
 * Server number:  6.0.36.0
 * OS Name:        Linux
 * OS Version:     2.6.32-504.el6.x86_64
 * Architecture:   amd64
 * JVM Version:    1.7.0_25-b15
 * JVM Vendor:     Oracle Corporation
 *
 * @param  {[type]} conn             [description]
 * @param  {[type]} tomcatinstallDir [description]
 * @return {[type]}                  [description]
 */
function extractTomcatProperties(conn, tomcatinstallDir) {

	var finalResult = {
		"installDir"  : tomcatinstallDir,
		"properties"  : null
	};
	// another option would be to invoke the script tomcatinstallDir/bin/version.sh
	return sshUtils.exec.command(conn,"cd "+tomcatinstallDir+"; java -cp  lib/catalina.jar org.apache.catalina.util.ServerInfo")
	.then(function(result){
		finalResult.properties = result;
		finalResult.properties.value = finalResult.properties.value.split('\n').map(function(line){
			if(line.trim().length !== 0 ){
				return {
					'name'  : line.substring(0,16).replace(/:/,'').trim(),
					'value' : line.substring(16).trim()
				};
			}
		}).filter(function(item){
			return item;	// remove empty (undefined) element
		});
		finalResult.success = true;
		return finalResult;
	}, function(error){
		finalResult.properties = error;
		return finalResult;
	});
}
exports.extractTomcatProperties = extractTomcatProperties;
