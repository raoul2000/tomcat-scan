"use strict";

var xmlParser = require('../src/helper/xml-parser'),
		descriptor= require('../src/tomcat/servlet/descriptor'),
		fs     		= require('fs'),
		assert    = require('chai').assert;

describe('Descriptor',function(done){

	it('extract servlet description from simple descriptor file ',function(done){

		var result = xmlParser.parse(
			'<?xml version="1.0" encoding="ISO-8859-1"?>' +
			'<!-- $Id: web.xml,v 1.2 2003/04/15 08:54:08 agrant Exp $ -->' +
			'<!DOCTYPE web-app PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.2//EN"' +
			    '"http://java.sun.com/j2ee/dtds/web-app_2.2.dtd">' +
			'<web-app xmlns="http://java.sun.com/xml/ns/javaee">' +
				'<display-name>CheckIn Servlet</display-name>' +
				'<servlet>' +
					'<servlet-name>checkin</servlet-name>' +
					'<servlet-name>checkin2</servlet-name>' +
					'<servlet-class>checkin.CheckinServlet</servlet-class>' +
					'<init-param>' +
						'<param-name>config</param-name>' +
						'<param-value>/WEB-INF/config/config.xml</param-value>' +
					'</init-param>' +
					'<load-on-startup>0</load-on-startup>' +
				'</servlet>' +
				'<servlet-mapping>' +
					'<servlet-name>checkin</servlet-name>' +
					'<url-pattern>/servlet/checkin</url-pattern>' +
				'</servlet-mapping>' +
			'</web-app>',
			{
				"ENTITY_1" : "value1",
				"ENTITY_2" : "value2"
			}
		);
		assert.isNotNull(result);
		assert.isObject(result);
		assert.isNotNull(result);
		assert.isObject(result);

		var servlet = descriptor.getAllServlet(result);
		assert.isTrue( servlet.hasOwnProperty('checkin'));
		assert.deepEqual(
			servlet,
			{
				"checkin":{
					"urlPattern":"/servlet/checkin",
					"name" : "checkin",
					"class":"checkin.CheckinServlet"
				}
			}
		);
		done();
	});


	it('parse the deployement descriptor again',function(done){
		var xmlStr = fs.readFileSync(__dirname + '/sample-data/web-tc.xml','utf8');

		var result = xmlParser.parse(xmlStr,{ "ENT" : "VAL"	}, function(ent){});

		assert.isNotNull(result);
		assert.isObject(result);
		assert.isNotNull(result);
		assert.isObject(result);

		var servlet = descriptor.getAllServlet(result);
		assert.deepEqual(
			servlet,
			{
				"Manager":{
					"urlPattern":"/findleaks",
					"name": "Manager",
					"class":"org.apache.catalina.manager.ManagerServlet"
				},
				"HTMLManager":{
					"urlPattern":"/html/*",
					"name": "HTMLManager",
					"class":"org.apache.catalina.manager.HTMLManagerServlet"
				},
				"Status":{
					"urlPattern":"/status/*",
					"name": "Status",
					"class":"org.apache.catalina.manager.StatusManagerServlet"
				},
				"JMXProxy":{
					"urlPattern":"/jmxproxy/*",
					"name": "JMXProxy",
					"class":"org.apache.catalina.manager.JMXProxyServlet"
				}
			}
		);
		done();
	});
});
