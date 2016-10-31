# Validador de tipos

Librería que valida diferentes tipos de multiples valores. Los tipos estan definidos
con el una función que los valida `validateFn` y un subtipo de dato, `simpleType` o
`complexType` (aun sin utilizar).

La función `validateFn(value,contents)` recibe dos argumento:
  * `value`: Es el valor que se quiere validator
  * `contents`: Es una lista con los subtipos que se definen para los elementos
  internos. Es utilizado para, por ejemplo, en tipos como array definir de que
  tipo tienen que ser los valores que encontramos dentro del array.
Ejemplo de tipo

```javascript
{
  "String":{
    "type":"simpleType",
    "validateFn": function(value, contents, cb){
      var result = typeof(value) == "string";
      if (cb){
        cb(result);
      }
      return result;
    }
  }
}
```

Ejemplo

```javasript

// Este array es de tipo array y el contenido es de tipo Number es decir
// Array.Number sera pasado como tipo lo que dara como resultado que contents
// sea igual a `[Number]`

var array = [1,2,3]

```
Permite anidamientos de tipos que se van pasando como argumento

``` javascript
// En este caso el tipo es Array.Array.Number por lo que contents
// recibirá en primera instancia [Array, Number]
var array = [[1,2,3],[4,5,6],[7,8,9]]
```

## Uso

Se debe incorporar el script validator.js donde se carga la librería

```html
    <script src="path/to/file/validator.js"></script>
```
Después podremos invocar a Validator para realizar diferentes funciones.

### `Validator.checkType(type, value, cb)`

Valida valor en un determinado typo.

  * `type` es el tipo con el que queremos comprar `value`
  * `value` es el dato que vamos a comprobar si es es del `type` indicado
  * `cb` callback ejecutado una vez se termine de comprobar el tipo. Recibe el booleano del resultado de la validación

### `Validator.validate(list, cb, conf)`

Valida un elemento polymer o varios si se le pasa una lista de elementos.

  * `list` component o lista de componentes que se quieren validar
  * `cb` funcion que se ejecutara tras terminar la validación de cada componente que se pase. Recibe un objeto como parametro:

  ```javascript
  {
    passed:{
      component:google-geocoding#geo,
      passed: true,
      phase: "definition", // Can be definition or change
      property:"data",
      type: "Array",
      value: []
    },
    errors:{
      component:google-geocoding#geo,
      passed: true,
      phase: "definition",
      property:"location",
      type: "Coordinates",
      value: 'test'
    },
  }
  ```
  * `conf` Configuración del validador.
    {
      executable: function que se ejecuta cuando se valida el componente, si es una lista de componente se puede pasar una lista de funciones a executar en el mismo orden que se reciben los componentes
      timeout: tiempo de espera hasta que el componente termine
    }
### `Validator.extendTypes(custom_type)`
  Permite extender y cambiar las propiedades que se validan asi como sus funciones

  * `custom_type` Objeto con las nuevas propiedades a definir. Deben tener el formato adecuado:{type:'simpleType or complexType', validateFn: function(value, contents, cb){//function que valide}}

  `value` es el valor que encuentra de entrada a la hora de Validator
  `contents` es la lista de propiedades anidadas, para validar propiedades del estilo Array.Number
  `cb` function de callback donde se le pasa el booleano con el resultado de la comprobación

### `Validator._type`
  Lista de los tipos que es capaz de manejar con sus funciones y sus subtipos
## Test

Antes de pasar los test es necesario instalar las dependencias

```bash
  npm install
```

Una vez instaladas las dependencias podemos pasar los test usando grunt o npm

```bash
  # para pasar los test usando grunt
  grunt test

  # para pasar los test usando npm
  npm test
```
