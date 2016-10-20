var webdriverio = require('webdriverio');
var program = require('commander');
var url_dir;
var success;
var errors;
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

var options;
try{
  var config_dir = program.config || './validator.config';
  options = require(config_dir);
} catch(err){
  options = { desiredCapabilities: { browserName: 'chrome'} };
}

var client = webdriverio.remote(options);
var validator = require('../validator.js');
var total;

console.log('Executing Validator test');
client
.init()
.url(url_dir)
.waitForVisible('.validator',5000)
.elements('.validator .item')
.then(function(list){
  total = list.value.length;
})
.getText('.validator.fail .item')
.then(function(list){
  if (list.length > 0){
    console.log('\tErrors ('+list.length +'/' + total +') : ');
  }
  list.forEach(function(el){
    console.log('\x1b[31m', '\t\t✖','\x1b[0m',el);
  });
  errors = list.length;
})
.getText('.validator.success .item')
.then(function(list){
  if (list.length > 0){
    console.log('\tSuccess ('+list.length +'/' + total +') : ');
  }
  list.forEach(function(el){
    console.log('\x1b[32m', '\t\t✓','\x1b[0m',el);
  });
  success = list.length;
})
.end()
.then(function(){
  if (options && options.desiredCapabilities && options.desiredCapabilities.browserName){
    console.log(options.desiredCapabilities.browserName+ '('+'\x1b[32m'+success+'\x1b[0m'+'/'+'\x1b[31m'+errors+ '\x1b[0m' +')');
  }
});
