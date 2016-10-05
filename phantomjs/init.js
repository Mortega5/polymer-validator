// var webdriverio = require('webdriverio');
// var options = { desiredCapabilities: { browserName: 'chrome' } };
// var client = webdriverio.remote(options);
// var validator = require('../validator.js');
// client
//     .init()
//     .url('http://localhost:8080/demo')
//     .waitForVisible('.validator', 10000)
//     .getText('.item').then(function(text) {
//         console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
//     })
//     .getText('.validator.fail').then(function(Text){
//         console.log('Fail', Text);
//     })
//     .end();
suite('my awesome website', function() {
    test('should do some chai assertions', function() {
        browser.url('http://webdriver.io');
        browser.getTitle().should.be.equal('WebdriverIO');
    });
});
