---
title: “this” is somewhat confusing in javascript
published: true
date: 2019-01-18
skills:
  - this
  - nodejs
---
The use of the `this` keyword is a frequent source of confusion in the javascript community. This post seeks to demystify this methodically and with clear examples. A lot revolves around *context* and *scope*, but these concepts will be explained where necessary (if you already have a solid understanding of scope and context, you would probably not be confused in the first place).

Here is an overview of the subjects that will be explored in relation to `this`:

**Global execution context**
- Browser runtime
- Nodejs runtime

**Function context (normal)**
- Strict vs. sloppy mode
- The apply() and call() methods
- The bind() method
- this and that

**Arrow functions**
- Using this in arrow functions
- Examples with differences

**Node modules**

## Global execution context

In the global context — i.e. code that is executed outside any functions — the `this` keyword has a slightly different implementation depending on the runtime.

### Browser runtime

In the browser, `this` refers to the global `window` object.

```js
console.log(this);  // Window {postMessage: f, ...}
console.log(this===window);  // true

a = 5;
console.log(this.a);  // 5

window.foo = 'bar';
console.log(this.foo); // "bar"
```

### Nodejs runtime

In nodejs (REPL): `this` refers to the `global` object.

```js
// start the node REPL
// $ node

this  // Object [global] { ... }
this === global  // true
a = 4
this.a  // 4
global.a // 4
global.a = 5
global === this  // true

// Here we reassign the global object (rather than update a property) 
// it will no longer reference the same object as `this`
global = "reassigned global"
global === this  // false
```

Be careful about node *modules* though. They are wrapped inside a function — which will create an execution context different from the global execution context. The `this` keyword refers to `module.exports` (more about this later).

## Function context (normal)

This section is limited to normal javascript functions created with the `function` keyword. The difference of `this` in arrow functions is significant and will be discussed in the next section.

### Strict vs. sloppy mode

Javascript has a *strict mode* and a *sloppy mode*, both with different syntax and runtime behavior, including the use of this ([more details here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)). ECMAScript 2015 modules are *strict* by default. Browsers execute *sloppy mode* by default and are typically able to switch to *strict mode* by including the following as the first line of a function or entire script:

```js
'use strict';
```

The reasons to introduce strict mode were to make the code work better with future upgrades, faster and more secure. One of the changes for more secure code involves the `this` keyword:

* In *sloppy* mode, `this` will default to the global object (named `window` in the browser or `global` in the nodejs runtime), potentially exposing the global object.

* In *strict* mode, the value of `this` remains at whatever it was set to when entering the execution context. When not set, it will be `undefined`.

```js
function f1() {
  return this;
}

// In a browser:
f1() === window;  // true 

// In Node:
f1() === global;  // true

function f2() {
  'use strict';  // set strict mode
  return this;
}

f2() === undefined;
// true
```

### The apply() and call() methods

When a function is called with `apply` or `call`, the first parameter will be converted to an object and the value of `this` in the function body will be bound to that object. This thereby allows you to pass the value of `this` to a function context.

```js
// An object can be passed as the first argument to call or apply and `this` will be bound to it.
const obj = {a: 'CUSTOM'};

// This property is set on the global object
a = 'GLOBAL';

function whatsThis() {
  return this.a;  // The value of this is dependent on how the function is called
}

whatsThis();          // 'GLOBAL'
whatsThis.call(obj);  // 'CUSTOM'
whatsThis.apply(obj); // 'CUSTOM'


// And in strict mode
function strictThis() {
  'use strict';
  return this.a;
}

strictThis();          // Throws TypeError: undefined has no properties
strictThis.call(obj);  // 'CUSTOM'
```

On a side note: the only difference between `apply` and `call` is that the arguments are passed as an array in the former and explicitly in the latter. Remember with: *“**A** for **a**rray and **C** for **c**omma.”*

### the bind() method

ECMAScript 5 introduced [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind). Calling `f.bind(someObject)` creates a new function with the same body and scope as `f`, but where `this` occurs in the original function, in the new function it is permanently bound to the first argument of bind, regardless of how the function is being called. You can think of it as implicitly calling the function with `f.call(someObject)` every time.

The following example is a common source of confusion and a prime use-case for the `bind()` method.

```js
x = "GLOBAL"

obj = {
  x: "OBJECT",
  getX: function() { return this.x }
}

console.log(obj.getX())      // 'OBJECT'

// Executed in the Global context, so `this` refers to the global object (in sloppy mode):
getX = obj.getX;
console.log(getX())          // 'GLOBAL' (This may not be what you expected!!!)

console.log(getX.apply(obj)) // 'OBJECT'

// Permanently bind the value of `this` to an object
boundGetX = obj.getX.bind(obj);
console.log(boundGetX());  // OBJECT
```

Another good use for `bind(this)` is the `setTimeout()` method. Within `window.setTimeout()`, the `this` keyword will be set to the `global` object by default. When working with class methods that require `this` to refer to class instances, you may explicitly bind `this` to the callback function, in order to maintain the instance.

```js
function DiceThrow() {
  this.pips = Math.floor(Math.random() * 6) + 1;
}

DiceThrow.prototype.throw = function() {
    console.log('The score is: ' + this.pips );
};

// Execute throw after 1 second delay
DiceThrow.prototype.delayedThrow = function() {
    window.setTimeout(this.throw.bind(this), 1000);
};

var dice = new DiceThrow();
dice.delayedThrow();  
// Trigger the throw() method after 1 second
```

### this and that

A common pattern is to assign the value of `this` to a variable, frequently named `that` or `self`, in an outer function and reference this variable in any of the inner functions.

```js
const that = this;
```

The names *that* or *self* have no syntactic meaning and are merely chosen by convention. The value of `that` will remain independent of execution context. This is similar to what you can achieve with the `bind()` method.

```js
/** Toggle indentation for body element. */
document.body.onclick = function(ev) {
    const that = this;
    /** Add a left indentation. */
    function indent () {
        console.log(this);  // Window(...)
        that.style.marginLeft = "4rem";
    }
    /** Remove any left indentation. */
    function outdent () {
        that.style.marginLeft = "0px";
    }
    if(this.style.marginLeft === "0px"){
        indent();
    } else {
        outdent();
    }
}
```

Inside the `indent()` and `outdent()` functions, the `this` keyword will refer to the global `Window` object. By contrast, `that` will always refer to the DOM element we are manipulating (document.body).

The same can be achieved with the `bind()` method.

```js
/** Toggle indentation for body element. */
document.body.onclick = function(ev) {
  
    /** Add a left indentation. */
    const indent = function () {
        this.style.marginLeft = "4rem";
    }.bind(this);
  
    /** Remove any left indentation. */
    const outdent = function () {
        this.style.marginLeft = "0px";
    }.bind(this);
  
    if(this.style.marginLeft === "0px"){
        indent();
    } else {
        outdent();
    }
}
```

The choice between using bind() or that are mainly stylistic. In deeper function hierarchies, it may be clearer to use `that` rather than binding every function to `this`. In other cases you may prefer bind() as it avoids the introduction of special variables.

## Arrow functions

An *arrow function expression* has a shorter syntax than a normal function, and behaves differently in several ways. Here is an example of an arrow function:

```
[0, 1, 2, 3].map(item => item*item));  // [0, 2, 4, 9]
```

### Using this in arrow functions

One of the different specifications is with the `this` keyword. Remember that every normal function defines its own `this` value (based on how it is called).

* a new object in the case of a constructor,

* undefined in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) function calls,

* the base object if the function is called as an “object method”,

* etc.

With an object-oriented style of programming, this is less than ideal. In an *arrow function*, the `this` value (internally) is not bound to the function; it is actually fetched lexically from the *scope* it sits inside. In other words: arrow functions have no `this`, so when you use `this` you’re talking to the outer scope.

### Examples with differences

In the earlier code snippets, the `indent` and `outdent` functions were executed in the global execution context, making this refer to the global object. We provided a context through `bind()` or the variable that to provide the `this` value we actually wanted.

As `this` will be fetched from the outer scope in an arrow function, it will default to the desired value in this example. This will simplify the code sample, and it also serves to demonstrate that an arrow function is not merely shorthand for a normal function.

```js
/** Toggle indentation for body element. */
document.body.onclick = function(ev) {
  
    /** Add a left indentation. */
    const indent = () => {
      console.log(this);  // DOM element <body>
      this.style.marginLeft = "4rem"; 
    }
  
    /** Remove any left indentation. */
    const outdent = () => { this.style.marginLeft = "0px"; }
  
    if(this.style.marginLeft === "0px"){
        indent();
    } else {
        outdent();
    }
}
```

Using arrow functions as object methods, will have a different result than you may expect, based on the previous example with nested functions. Tthis example demonstrates the difference:

```js
x = "Global";

objArrow = {
  x: "Object with arrow method",
  logX: () => { console.log(this.x); }
}

objNormal = {
  x: "Object with normal method",
  // ES6 shorthand notation for normal function
  logX () { console.log(this.x); }
}

objArrow.logX();  // "Global"
arrowX = objArrow.logX;
arrowX();  // "Global"

objNormal.logX();  // "Object with normal method"
normalX = objNormal.logX;
normalX();  // "Global"

```

Why does the arrow method not take the `this` value from the enclosing object? Because it will get the `this` value from the enclosing *scope* and an object does not define scope in Javascript, hence it is scoped in the global scope. The value of `this` is independent of how the method is executed.

In contrast, normal functions define their own scope, but the value of `this` is dependent on how the function is executed.

## Node modules

Within NodeJS modules, `this` refers to the same object as `module.exports`. In the example below, a *required* function is executed in the module context (`this` == `module.exports`), and in the global context (`this` == `global`, as expected).

```js
module.exports.test = function () {
  console.log(this);
  console.log(this === module.exports);
};
```

```js
const mdl = require('./module');
const test = require('./module').test;

mdl.test();
// { test: [Function] }
// true
test();
// Object [global] { ... }
// false
```

Where does the module.exports come from? Node wraps module code inside a function, so our code above will be compiled to:

```js
(function (exports, require, module, __filename, __dirname) {
    // custom code:    
    module.exports.test = function () {  console.log(this);
    console.log(this === module.exports);};
});
```

And is called like this, when you invoke require():

```js
var args = [self.exports, require, self, filename, dirname];
return compiledModule.apply(self.exports, args);
```

## Conclusion

Exploring the `this` keyword results in a journey through many of the features and peculiarities of Javascript. It should give you better understanding of the differences between:

* *context* & *scope*,

* *strict mode* & *sloppy mode*,

* *normal functions* & *arrow functions,*

* *browser runtime* & *nodejs runtime,*

* *global context* & *function context.*

Most importantly, the value of `this` should never again be a mystery, or at least one that can be easily resolved by the provided examples.

## References

* [MDN: “this” keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

* [Understanding that and bind, by Raji Ayinla](https://codeburst.io/understanding-that-and-bind-8778f779b149)

* [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

* [MDN: Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

* [ES6 Arrow functions, syntax and lexical scoping, by Todd Motto](https://toddmotto.com/es6-arrow-functions-syntaxes-and-lexical-scoping/)

* [Understanding scope and context in Javascript, by Ryan Morr](http://ryanmorr.com/understanding-scope-and-context-in-javascript/)
