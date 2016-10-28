
(function(window){
  var types = {
    "String":{
      "type":"simpleType",
      "validateFn": function(value, contents, cb){
        var result = typeof(value) == "string";
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Boolean":{
      "type":"simpleType",
      "validateFn": function(boolean, contents, cb){
        var result = typeof(boolean) == "boolean";
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Number": {
      "type": "simpleType",
      "validateFn": function(value, contents,cb){
        var result = typeof(value) === "number";
        if (cb){
          cb(result);
        }
        return result;
      },
    },
    "Object": {
      "type": "simpleType",
      "validateFn": function(object, contents, cb){
        var result =  object instanceof Object;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Array": {
      "type": "simpleType",
      "validateFn": function(array, contents,cb){
        var result = array instanceof Array;
        // Check if conent is the same type that content
        if (result && contents && contents.length > 0){
          var content = contents[0];
          for(var i =0;i<array.length && result;i++){
            result = types[content].validateFn(array[i],contents.slice(1,contents.length));
          }
        }
        if (cb){
          cb(result);
        }
        return result;
      },
    },
    "Date": {
      "type": "simpleType",
      "validateFn": function(date, contents, cb){
        var result = date instanceof Date;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Function": {
      "type": "simpleType",
      "validateFn": function(fn, contents, cb){
        var result = fn instanceof Function;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Integer": {
      "types":"simpleType",
      "validateFn": function(integer, contents, cb){
        var result = typeof(integer) && integer%1 === 0;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "PositiveInteger": {
      "types": "simpleType",
      "validateFn": function(positive, contents, cb){
        var result = typeof(positive) && positive >=0;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "NegativeInteger": {
      "types": "simpleType",
      "validateFn": function(negative, contents, cb){
        var result = typeof(negative) && negative < 0;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "HTMLElement": {
      "types": "simpleType",
      "validateFn": function(element,contents, cb){
        var result = element instanceof HTMLElement;

        if (result && contents && contents.length > 0){
            result = element.tagName === contents[0].toUpperCase() && result;
          }

        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Coordinates": {
      "type": 'complexType',
      "validateFn": function(coordinates,contents, cb){
        var result= false;
        if (coordinates instanceof Object && typeof(coordinates.longitude) !== 'undefined' && typeof(coordinates.latitude) !== 'undefined') {
          // coordinates are numbers
          result = types.Number.validateFn(coordinates.longitude) && types.Number.validateFn(coordinates.latitude);
          // check latitude is between -90 and +90
          result = coordinates.latitude < 90 && coordinates.latitude > -90 && result;
          // check longitude is between -180 and +180
          result = coordinates.longitude < 180 && coordinates.longitude > -180 && result;
        }
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "URL":{
      'type':'simpleType',
      'validateFn': function(value,contents,cb){
        var result = value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        result = result?true:false;
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Blob": {
      'type': 'simpleType',
      'validateFn': function(blob,contents,cb){
        var result = blob instanceof Blob;
        var content,type;
        // only permite 1 lvl of content.
        if (result && contents && contents.length > 0){
          content = contents[0];
          type = blob.type;
          result = type.match(new RegExp(content))? result:false;
        }
        if (cb){
          cb(result);
        }
        return result;
      }
    },
    "Image": {
      'type': 'simpleType',
      'validateFn': function(img, contents,cb){
        result = img instanceof Image;
        if (result && contents){
          result = result && img.src !== undefined;
        }
        if (cb){
          cb(result);
        }
        return result;
      }
    }
  };

  window.Validator = (function(types){
    Validator = function(){
      this._types = types;
    };
    Validator.prototype.checkType = function(type,value,cb){
      var content;
      var checkContent = type.split('.');
      if (checkContent.length > 1){
        type = checkContent[0];
        content = checkContent.slice(1,checkContent.length);
      }

      if (type === undefined || value === undefined || !this._types[type]){
        console.error('Unsupported type ', type);
      } else {
        this._types[type].validateFn(value,content,cb);
      }
    };
    Validator.prototype.validate = function(list, cb){
      // single component
      if (list instanceof HTMLElement){
        this.validateComponent(list,cb);
      } else if (list instanceof Array){
        for (var i=0;i<list.length;i++){
          this.validateComponent(list[i],cb);
        }
      }
    };
    Validator.prototype.validateComponent = function(component,cb, timeout){
      var errors = [];
      var passed = [];
      if (!component){
        console.error('Error: component is not defined');
        return;
      }
      if (!component.properties){
        console.error('Error: component has not properties or is not a polymer element');
        return ;
      }
      var pushData = function(res){
        if (!res){
          errors.push({property: property,component:component,type:properties[property].type, passed:res,phase:'definition',value:component[property]});
        } else {
          passed.push({property: property,component:component,type:properties[property].type, passed:res,phase:'definition',value:component[property]});
        }

      };
      var changedData = function(e){
        var property = e.type.match(/([\S]*)-changed/)[1];
        Validator.checkType(properties[property].type, component[property], function(res){
          if (!res){
            errors.push({property: property,component:component,type:properties[property].type, passed:res,phase:'change',value:component[property]});
          } else {
            passed.push({property: property,component:component,type:properties[property].type, passed:res,phase:'change',value:component[property]});
          }
        });
      };
      var properties = component.properties;
      for (var property in properties){
        if (properties.hasOwnProperty(property)){
          if (properties[property].bind === 'output' && component[property] !== undefined){
            Validator.checkType(properties[property].type, component[property], pushData.bind(this));
            var name = property + '-changed';
            component.addEventListener(name,changedData.bind(this));
          }
        }
      }
      //'✓'
      var createReport = function(name, passed, errors){
        var body = document.querySelector('body');
        body.setAttribute('ready',true);
        // Component header
        var component_name = document.createElement('H1');
        component_name.innerHTML = name;
        component_name.className = 'name';
        // Error report
        var div_errors = document.createElement('UL');
        var h1_errors = document.createElement('H2');
        h1_errors.innerHTML = "Errors with output type";
        h1_errors.className= 'title';
        div_errors.appendChild(h1_errors);
        div_errors.className = 'validator fail';

        // Success report
        var div_passed = document.createElement('UL');
        var h1_passed = document.createElement('H2');
        h1_passed.innerHTML = "Success with output type";
        h1_passed.className = 'title';
        div_passed.appendChild(h1_passed);
        div_passed.className = 'validator success';

        for (var i=0;i<errors.length;i++){
          var div_err = document.createElement('LI');
          div_err.innerHTML = '<span class="property">' + errors[i].property + '</span> should be type of ' + errors[i].type + ' in ' + errors[i].phase + ' phase';
          div_err.className = 'validator item';
          div_errors.appendChild(div_err);
        }
        for (var j=0;j<passed.length;j++){
          var div_pas = document.createElement('LI');
          div_pas.innerHTML = '<span class="property">' + passed[j].property + '</span> is type  ' + passed[j].type + ' in ' + passed[j].phase + ' phase';
          div_pas.className = 'validator item';
          div_passed.appendChild(div_pas);
        }
        body.appendChild(component_name);
        if (errors.length !==0){
          body.appendChild(div_errors);
        }
        if (errors.succes !==0){
          body.appendChild(div_passed);
        }
      };
      setTimeout(function(){
        cb({passed: passed, errors:errors});
        createReport(component.tagName, passed,errors);

      }.bind(this),timeout|| 3000);
    };
    return new Validator();
  })(types);

})(typeof window !== 'undefined' ? window : this);
