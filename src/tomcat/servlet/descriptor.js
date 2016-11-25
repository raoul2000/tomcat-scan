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

  var result = [], servletName = "", servletItem;

  var servletTagList = dom.getElementsByTagName("servlet");
  var servletMappingTagList = dom.getElementsByTagName("servlet-mapping");
  for(var i=0; i<servletTagList.length; i ++) {

    servletName  = servletTagList[i].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue;

    servletItem = {
      "name"        : servletName,
      "urlPattern"  : [],
      "class"       : null  // not all servlet have a servlet-class
    };
    try {
      servletItem.class = servletTagList[i].getElementsByTagName('servlet-class').item(0).firstChild.nodeValue;
    } catch (e) {
        console.warn("servlet name "+servletName+" has no class value");
        servletItem.class = "";
    }

    try {
      for (var j = 0; j < servletMappingTagList.length; j++) {
        if( servletName === servletMappingTagList[j].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue) {
          var pattern = servletMappingTagList[j].getElementsByTagName('url-pattern').item(0);
          if(pattern.firstChild) {
            servletItem.urlPattern.push(pattern.firstChild.nodeValue);
          } else {
            servletItem.urlPattern.push("");
          }
        }
      }
    } catch (e) {
      console.warn("failed to read url-pattern for servlet name = "+servletName);
    }
    result.push(servletItem); // add to servlet list
  }
  return result;
}



function getAllServlet_orig(dom) {
  // because the xpath module was not working correctly, use xmldom
  // to extract required info

  var servletList = {}, servletName = "", servletClassList = "";

  var elementList = dom.getElementsByTagName("servlet");
  for(var i=0; i<elementList.length; i ++) {

    servletName  = elementList[i].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue;

    servletList[servletName] = {
      "name"        : servletName,
      "urlPattern" : null,
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
      var urlPatternEl = elementList[j].getElementsByTagName('url-pattern').item(0);
      if( urlPatternEl.firstChild) {
        servletList[servletName].urlPattern = urlPatternEl.firstChild.nodeValue;
      } else {
        servletList[servletName].urlPattern = "";
      }
    }
  }
  return servletList;
}
exports.getAllServlet = getAllServlet;
