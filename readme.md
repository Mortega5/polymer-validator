# Validador de tipos

Librería que valida diferentes tipos de multiples valores. Los tipos estan definidos
con el una función que los valida `validateFn` y un subtipo de dato, `simpleType` o
`complexType` (aun sin utilizar).

La función `validateFn(value,contents)` recibe dos argumento:
  * `value`: Es el valor que se quiere validator
  * `contents`: Es una lista con los subtipos que se definen para los elementos
  internos. Es utilizado para, por ejemplo, en tipos como array definir de que
  tipo tienen que ser los valores que encontramos dentro del array.

  ```javasript
    // Este array es de tipo array y el contenido es de tipo Number es decir
    // Array.Number sera pasado como tipo lo que dara como resultado que contents
    // sea igual a `[Number]``
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

  ### `Validator.validate(type, value)`

    * `type` es el tipo con el que queremos comprar `value`
    * `value` es el dato que vamos a comprobar si es es del `type` indicado

    `return` si value es del typo indicado

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
