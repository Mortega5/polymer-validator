#!/usr/bin/env node

// Dependencies
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var program = require('commander');
var connect = require('connect');
var serveStatic = require('serve-static');
var test_dir;
var success;
var errors;

// Program options
program
.version('0.1.0')
.usage('[options] <test_file>')
.option('-c, --config <file>','Set config file')
.option('-p --port <port>','Keep browser active. Default 8080',parseInt)
.option('-t --timeout <timeout>','Waiting time to load result in ms',parseInt)
.option('-r --root <dir>','Directory root for the server')
.option('-h host <host>','Host direction')
.arguments('<test_file> ')
.action(function(test){
  test_dir = test;
})
.parse(process.argv);
if (typeof test_dir === 'undefined') {
  program.help();
}
program.host = program.host || 'localhost'; //default host localhost
program.port = program.port || 8080; // default server port 8080
test_dir = 'http://' + program.host + ':' + program.port + '/' + test_dir;

// Default setting
var options;
try{
  var config_dir = program.config || './validator.cnf.json';
  options = require(config_dir);
} catch(err){
  options = { browserName: 'chrome'};
}

// Set server
connect().use(serveStatic(program.root || __dirname)).listen(program.port,function(){
  console.log('Server running on ' + program.port + '...');
  // selenium config
  var server = this;
  var client = new webdriver.Builder().withCapabilities(options).build();
  var validator = require('./validator.js');
  var total;


  // Execute
  console.log('Executing Validator test');
  client.get(test_dir);
  client.wait(function(){
    return client.isElementPresent(webdriver.By.className('validator'));
  },program.timeout || 10000).then(function(){

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
      server.close();
    });
  },function(){
    console.log(test_dir + ' is not available or timeout end before test was completed.');
    client.quit();
    server.close();
  });
});
