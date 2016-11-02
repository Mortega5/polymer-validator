var assert = chai.assert;
var count;
var setPromises = function(n){
  count = n;
};
var resolvePromise = function(done){
  count -=1;
  if (count === 0){
    done();
  }
};
describe('Testing diferent types using Validator', function(){
  beforeEach(function(){
    count = 0;
  });
  it('[String] Check if a string is detected as String', function(done){

    setPromises(2);
    Validator.checkType('String','test_string', function(res){
      assert.isTrue(res, 'test_string is identified as String');
      resolvePromise(done);
    });
    Validator.checkType('String',123,function(res){
      assert.isFalse(res);
      resolvePromise(done);
    });
  });
  it('[Number] Check if a number is detected as Number', function(done){
    setPromises(4);
    Validator.checkType('Number',123.123,function(res){
      assert.isTrue(res, '123.123 is identified as number');
      resolvePromise(done);
    });
    Validator.checkType('Number',123, function(res){
      assert.isTrue(res,'123.123 is identified as number');
      resolvePromise(done);
    });
    Validator.checkType('Number',-123, function(res){
      assert.isTrue(res, '123.123 is identified as number');
      resolvePromise(done);
    });
    Validator.checkType('Number','123', function(res){
      assert.isFalse(res, 'Should return false: \'123\' is a string');
      resolvePromise(done);
    });
  });
  it('[Object] Check if a object is detected as Object', function(done){
    setPromises(1);
    Validator.checkType('Object', {test:'test'},function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });
  });
  it('[Array] Check if an array is detected as Array', function(done){
    setPromises(3);
    Validator.checkType('Array', [1,2,3], function(res){
      assert.isTrue(res, '');
      resolvePromise(done);
    });
    Validator.checkType('Array', [], function(res){
      assert.isTrue(res, '');
      resolvePromise(done);
    });
    Validator.checkType('Array', {},function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });

  });
  it('[Date] Check if a date is detected as date', function(done){
    setPromises(2);
    Validator.checkType('Date', new Date(),function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });
    Validator.checkType('Date', 'Tue Sep 27 2016 11:07:10 GMT+0200 (CEST)',function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });
  });

  it('[Function] Check if a function is detected as function', function(done){
    setPromises(3);
    Validator.checkType('Function', function(){},function(res){
      assert.isTrue(res, '');
      resolvePromise(done);
    });
    Validator.checkType('Function', 'function(){}',function(res){
      assert.isFalse(res, '');
      resolvePromise(done);
    });
    Validator.checkType('Function', function(){return function(){};},function(res){
      assert.isTrue(res, '');
      resolvePromise(done);
    });
  });

  it('[Integer] Check if a integer is detected as integer', function(done){
    setPromises(3);
    Validator.checkType('Integer',123,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });
    Validator.checkType('Integer',0,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });
    Validator.checkType('Integer',1.1,function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });
  });

  it('[PositiveInteger] Check if a positiveInteger is detected as positiveInteger', function(done){
    setPromises(2);
    Validator.checkType('PositiveInteger',1,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });

    Validator.checkType('PositiveInteger',-1,function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });
  });

  it('[NegativeInteger]  Check if a negativeInteger is detected as negativeInteger', function(done){
    setPromises(2);
    Validator.checkType('NegativeInteger',-1,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });

    Validator.checkType('NegativeInteger',1,function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });

  });

  it('[HTMLElement]  Check if a HTML element is detected as HTML element', function(done){
    setPromises(2);
    var div = document.createElement('DIV');
    Validator.checkType('HTMLElement',div,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });

    Validator.checkType('HTMLElement','div',function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });
  });

  it('[Coordinates]  Check if a coordinates is detected as Coordinates (complexType)', function(done){
    var coordinates = {longitude: 12.3412,latitude:12.312};
    setPromises(6);
    Validator.checkType('Coordinates',coordinates,function(res){
      assert.isTrue(res,'');
      resolvePromise(done);
    });

    Validator.checkType('Coordinates',{},function(res){
      assert.isFalse(res,'');
      resolvePromise(done);
    });

    Validator.checkType('Coordinates',{latitude:null,longitude:null},function(res){
        assert.isTrue(res,'{latitude:null,longitude:null} is a correct Coordinate object');
        resolvePromise(done);
    });

    coordinates.longitude = undefined;
    Validator.checkType('Coordinates',coordinates,function(res){
      assert.isFalse(res,'Should return false: longitude is not defiend');
      resolvePromise(done);
    });

    coordinates.longitude = 180.5;
    Validator.checkType('Coordinates',coordinates,function(res){
      assert.isFalse(res,'Should return false: longitude > 180 ');
      resolvePromise(done);
    });

    coordinates.latitude = 90.5;
    coordinates.longitude = 10.5;
    Validator.checkType('Coordinates',coordinates,function(res){
      assert.isFalse(res,'Should return false: latitude > 90');
      resolvePromise(done);
    });
  });

  it('[URL] Check if a URL is detected as URL type', function(done){
    var url = "https://github.com/";
    setPromises(4);
    Validator.checkType('URL',url,function(res){
      assert.isTrue(res,'Correct URL is not detected as URL');
      resolvePromise(done);
    });

    var fakeUrl= 'http:wrongUrl.com';
    Validator.checkType('URL',fakeUrl,function(res){
      assert.isFalse(res,'Fake URL is not detected as URL');
      resolvePromise(done);
    });

    url = "https://github.com:8080/";
    Validator.checkType('URL',url,function(res){
      assert.isTrue(res,'Correct URL is not detected as URL');
      resolvePromise(done);
    });

    url ="https://github.com:8080/test";
    Validator.checkType('URL',url,function(res){
      assert.isTrue(res,'Correct URL is not detected as URL');
      resolvePromise(done);
    });

    url ="https://github.com:8080/test?a=asdas";
    Validator.checkType('URL',url,function(res){
      assert.isTrue(res,'Correct URL is not detected as URL');
      resolvePromise(done);
    });

  });
  it('[Blob] Check if a Blob is detected as Blob type', function(done){
    var blob = new Blob();
    var fakeBlob = {};
    setPromises(2);
    fakeBlob.size = 0;
    fakeBlob.type = "";
    Validator.checkType('Blob',blob, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Blob',fakeBlob, function(res){
      assert.isFalse(res);
      resolvePromise(done);
    });
  });

});
describe('Testing multiple types defined', function(){
  it('[Array] Array with content predefined', function(done){
    var array = [1,2,3];
    setPromises(6);
    Validator.checkType('Array',array, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Array.Number',array, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Array.Array.String',array, function(res){
      assert.isFalse(res);
      resolvePromise(done);
    });

    array = [[1,2,3],[1,2,3],[1,2,3],[1,2,3]];
    Validator.checkType('Array.Array',array, function(res){
      assert.isTrue(res,'Should return true: Array of array');
      resolvePromise(done);
    });
    Validator.checkType('Array.Array.Number',array, function(res){
      assert.isTrue(res,'Shoud return true: Array of array of numbers');
      resolvePromise(done);
    });
    Validator.checkType('Array.Array.String',array, function(res){
      assert.isFalse(res, 'Shoud return false: Array of array of numbers not string');
      resolvePromise(done);
    });
  });
  it('[Blob] Blob with content predefined', function(done){
    var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
    var blob = new Blob(aFileParts,{type:'text/html'});
    setPromises(4);
    Validator.checkType('Blob.text',blob, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Blob.html',blob, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Blob.text/*',blob, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });
    Validator.checkType('Blob.image/*',blob, function(res){
      assert.isFalse(res);
      resolvePromise(done);
    });

  });

  it('[HTMLElement] HTMLElement with content predefined', function(done){
    setPromises(1);
    var div = document.createElement('DIV');
    Validator.checkType('HTMLElement.div', div, function(res){
      assert.isTrue(res);
      resolvePromise(done);
    });

  });
});
