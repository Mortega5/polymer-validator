#!/usr/bin/env node

// Dependencies
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var program = require('commander');
var url_dir;
var success;
var errors;

// Program options
program
.version('0.1.0')
.usage('[options] <url>')
.arguments('<url>')
.option('-c, --config','Set config file')
// .option('-p --persistent','Keep browser active')
.action(function(url){
  url_dir = url;
})
.parse(process.argv);
if (typeof url_dir === 'undefined') {
  program.help();
}

// Default setting
var options;
try{
  var config_dir = program.config || './validator.cnf.json';
  options = require(config_dir);
} catch(err){
  options = { browserName: 'chrome'};
}

// selenium config
var client = new webdriver.Builder().withCapabilities(options).build();
var validator = require('./validator.js');
var total;

// Execute
console.log('Executing Validator test');
client.get(url_dir);
client.wait(function(){
  return client.isElementPresent(webdriver.By.className('validator'));
},10000);

//Get total test
client.findElements(webdriver.By.xpath("//*[contains(@class, 'item')]")).then(function(list_test){
  total = list_test.length;
});
//Get errors
client.findElements(webdriver.By.xpath("//ul[contains(@class, 'fail')]/li[contains(@class, 'item')]"))
.then(function(list_error){
  if (list_error.length > 0){
    console.log('\tErrors ('+list_error.length +'/' + total +'): ');
  }
  errors = list_error.length;
  list_error.forEach(function(el){
    el.getText().then(function(text){
      console.log('\x1b[31m', '\t\t✖','\x1b[0m',text);
    });
  });
});

//get success
client.findElements(webdriver.By.xpath("//ul[contains(@class, 'success')]/li[contains(@class, 'item')]"))
.then(function(list_success){
  if (list_success.length > 0){
    console.log('\tSuccess ('+list_success.length +'/' + total +'): ');
  }
  success = list_success.length;
  list_success.forEach(function(el){
    el.getText().then(function(text){
      console.log('\x1b[32m', '\t\t✓','\x1b[0m',text);
    });
  });
});

// close client
client.quit().then(function(){
  if (options && options.browserName){
    var browser = options.browserName;
    console.log('\x1b[34m' + browser+ '\x1b[0m('+'\x1b[32m'+success+'\x1b[0m'+'/'+'\x1b[31m'+errors+ '\x1b[0m' +')');
  }
});
