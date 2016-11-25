"use strict";

var context  	= require('../src/tomcat/context'),
	  extract = require('../src/helper/extractor'),
		fs 			  = require('fs'),
	  assert  	= require('chai').assert;

var scanResult;

describe('Extractor',function(done) {

  before(function() {
    scanResult = JSON.parse(fs.readFileSync(__dirname + "/output/test-main-scanResult.json", "utf-8" ));
  });

  it('extracts servlet list from scan result',function(done){
    var result = extract.servletList(scanResult);
    assert.isArray(result);
    console.log(result);
    done();
  });
});
