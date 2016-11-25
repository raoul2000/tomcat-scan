"use strict";


function servletList(scanResult, ip) {
  var result = [];

  scanResult.contexts.forEach(function(ctxFile){
    ctxFile.list.forEach(function(ctx) {
      if( Array.isArray(ctx.servlets)) {
        ctx.servlets.forEach(function(servlet){
          result.push(servlet);
        });
      }
    });
  });

  return result;
}

exports.servletList = servletList;
