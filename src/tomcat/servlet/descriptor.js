"use strict";

/**
 * Extract context informations from a tomcat web descriptor provided as a XML string passed as argument.
 * Returns an object where the key is the servlet name and value are servlet class and url-pattern
 * Example :
 *  {
 *    "servlet name": {
 *      "url-pattern": "/findleaks",
 *      "class": "org.apache.catalina.manager.ManagerServlet"
 *    },
 *    etc.
 *  }
 *
 * @param  {dom} Document
 * @return {object}      hash where the key is the servlet name and value are
 * servlet class and url-pattern
 */
function getAllServlet(dom) {
  // because the xpath module was not working correctly, use xmldom
  // to extract required info

  var servletList = {}, servletName = "", servletClassList = "";

  var elementList = dom.getElementsByTagName("servlet");
  for(var i=0; i<elementList.length; i ++) {
    servletName  = elementList[i].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue;

    servletList[servletName] = {
      "name"        : servletName,
      "url-pattern" : null,
      "class"       : null  // not all servlet have a servlet-class
    };
    servletClassList = elementList[i].getElementsByTagName('servlet-class');
    if(servletClassList.length !== 0) {
      servletList[servletName].class = servletClassList.item(0).firstChild.nodeValue;
    }
  }

  elementList = dom.getElementsByTagName("servlet-mapping");
  for(var j=0; j<elementList.length; j ++) {
    servletName = elementList[j].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue;
    if( servletList.hasOwnProperty(servletName)) {
      servletList[servletName]["url-pattern"] = elementList[j].getElementsByTagName('url-pattern').item(0).firstChild.nodeValue;
    }
  }
  return servletList;
}
exports.getAllServlet = getAllServlet;
