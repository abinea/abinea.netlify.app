---
title: Javascript类型检测
date: 2021-04-25T17:57:43.000+00:00
tag: JS
duration: 8min
---

Javascript 是一种类型松散的动态类型语言，这意味，你可以随时改变 JavaScript 变量的类型，并且由类型不一致的错误仅在运行时抛出。在网络通信过程，你无法保证接收的数据类型与预期一致，是否会导致系统出现未定义行为。

因此，在编写成熟、可控的 JavaScript 程序，我们需要对变量的类型进行检测。

## 内置类型

首先来谈谈 JavaScript 内置的数据类型，包括**原始数据类型**或者叫**值类型**，对应的，有**引用数据类型**。

原始数据类型：

-   number
-   string
-   boolean
-   undefined
-   null
-   symbol
-   bigint

引用数据类型：

-   Function
-   Array（TypedArray）
-   Object
-   RegExp
-   Math
-   Date
-   Map
-   Set
-   …

对于引用数据类型，由于 ECMA 不断扩充其标准，无法一一列出。自定义的类型和 BOM、DOM 中使用的接口及类型通常都是继承自 Object 的引用数据类型，且其具体类型可以通过下述各方法获取。

## 检测方法

类型检测常见的方法有以下：

1. typeof
2. instanceof
3. constructor
4. Object.prototype.toString.call
5. Duck typing

### typeof 判断基本类型

使用**运算符**`typeof`返回的是类型名，结果仅包括以下 7 种：number、string、boolean、undefined、symbol、object、function。

```jsx
const num = 32
const str = "32"
const bool = true
const undef = undefined
const sym = Symbol()

console.log(typeof num) //number
console.log(typeof str) //string
console.log(typeof bool) //boolean
console.log(typeof undef) //undefined
console.log(typeof sym) //symbol
```

null 类型和大部分引用类型都不能用`typeof`直接判断。

```jsx
const nul = null
const obj = new Object()
const arr = new Array()
const fun = new Function()
const reg = new RegExp()

console.log(typeof nul) //object
console.log(typeof obj) //object
console.log(typeof fun) //function
console.log(typeof arr) //object
console.log(typeof reg) //object
```

> 注意：用 typeof 判断 null、Array、Date、RegExp 等类型结果均为"object"。

null 被判为对象类型的原因：在判断数据类型时，是根据机器码低位标识来判断的，而 null 的机器码标识为全 0，而对象的机器码低位标识为 000。 所以`typeof null`的结果被误判为`object` 。

### instanceof 判断引用数据类型

`instanceof`用于检查构造函数的`prototype`属性是否出现在某个实例对象的原型链上，需要注意的是，对于原始数据类型，`__proto__`属性是不存在的，即无法查找原型链，除非使用对应的构造函数去创建实例。

```jsx
const obj = new Object()
const arr = new Array()
const fun = new Function()
const reg = new RegExp()

console.log(obj instanceof Object) //true
console.log(arr instanceof Array) //true
console.log(fun instanceof Function) //true
console.log(reg instanceof RegExp) //true

const num1 = 32
const num2 = new Number(32)
console.log(num1 instanceof Number) //false
console.log(num2 instanceof Number) //true
```

也许有人会说`num1.__proto__===Number.prototype`结果是 true 啊，这是因为包装器的原因，对原始数据类型直接调属性是不符合 instanceof 的定义和行为的。当然，对于简单判断原始类型的场景，我们除了 typeof，也可以使用这种判断原型的方法。

对 null 和 undefined，因为不存在所谓原型链，也没有所谓包装器，没法用判断原型的方法去判断。

另外，虽然`instanceof`能够判断出 arr 是 Array 的实例，但它“同时也是”Object 的实例，因为`instanceof`会在原型链一直寻找判断，找到则返回 true。这对判断一个未知引用类型并不友好。

```jsx
const arr = new Array()
console.log(arr instanceof Array) //true
console.log(arr instanceof Object) //true
console.log((arr.__proto__.__proto__ = Object.prototype)) //true
```

> 对于这种情况，可以换用 constructor 进行判断。

instanceof 的大概过程，可以自己验证一下：

```jsx
function instanceOf(val, constructor) {
	// 如果是引用类型再进行判断
	if (
		(typeof val === "object" && val !== null) ||
		typeof val === "function"
	) {
		const proto = constructor.prototype
		while (val.__proto__ !== null) {
			if (val.__proto__ === proto) {
				return true
			}
			val = val.__proto__
		}
	}
	return false
}
```

**注意不同 window 或 iframe 间的对象检测不能使用 instanceof。**

题外话：在 ES6 中添加了 symbol 类型，目的是避免对象的属性都是字符串键导致冲突，我个人对 symbol 之所以要添加的理解是，与 Proxy 和 Reflect 添加目的一样，是为了开放 JavaScript 语言的底层，供开发者去编写一些元编程的黑魔法提供便利。

比如 Symbol 的各种静态方法可以修改一些方法的行为，针对`instanceof`，有`Symbol.hasInstance`方法，能修改判断某对象是否为某构造器的实例的行为。

```jsx
class Array1 {
	static [Symbol.hasInstance](instance) {
		return Array.isArray(instance)
	}
}

console.log([] instanceof Array1) //true
```

### constructor 判断类型

访问实例对象的`constructor`属性会返回其构造函数，因此判断构造函数名来得到类型，如`" ".constructor === String`。

```jsx
const num = 32
const str = "32"
const nul = null
const undef = undefined
const sym = Symbol()
const object = new Object()
const arr = new Array()
const fun = new Function()

console.log(num.constructor) //ƒ Number() { [native code] }
console.log(str.constructor) //ƒ String() { [native code] }
console.log(nul.constructor) //Uncaught TypeError: Cannot read property 'constructor' of null
console.log(undef.constructor) //Uncaught TypeError: Cannot read property 'constructor' of undefined
console.log(sym.constructor) //ƒ Symbol() { [native code] }
console.log(obj.constructor === Object) //true
console.log(arr.constructor === Array) //true
console.log(fun.constructor === Function) //true
```

无法用`constructor`判断 null 和 undefined，但可以避免使用`instanceof`时 arr 的原型对象既可以为 Array 也可以是 Object。

### Object.prototype.toString.call

`toString`是 Object 类型的原型方法，任何继承 Object 类型的对象都拥有 toString 方法。

所有`typeof`返回为`”object”`的对象都有一个内部属性`[[class]]`，这个内部属性无法直接访问，一般通过`Object.prototype.toString`来查看。

如果对象的 toString 方法没有重写的话，直接在对象上调用 toString 方法，可以得到当前对象的 [[Class]]，其格式为`"[object Xxx]"`，其中 Xxx 为对象的类型。

但除了 Object 类型的对象外，其他类型调用 toString 方法返回的都是其内容的字符串，所以我们需要**使用`call`或者`apply`来改变`toString`方法的执行上下文**。

```jsx
let num = 32
let nul = null
let undef = undefined
let sym = Symbol()

console.log(Object.prototype.toString.apply(num)) //"[object Number]"
console.log(Object.prototype.toString.call(nul)) //"[object Null"
console.log(Object.prototype.toString.apply(undef)) //"[object Undefined]"
console.log(Object.prototype.toString.call(sym)) //"[object Symbol]"

const obj = new Object()
const arr = new Array()
const fun = new Function()

console.log(Object.prototype.toString.call(obj)) //"[object Object]"
console.log(Object.prototype.toString.call(arr)) //"[object Array]"
console.log(Object.prototype.toString.call(fun)) //"[object Function]"
```

`Object.prototype.toString.call`可以判断 null，但通常用`val===null`来判断是否为 null。

修改对象的`Symbol.toStringTag`属性可以修改它的`Object.prototype.toString.call`的结果，因此`[[class]]`并不是完全不可改的。

基于 WebIDL 规范，浏览器正在向所有 DOM 原型对象添加`Symbol.toStringTag`属性。

```jsx
const test = document.createElement("button")
test.toString() //"[object HTMLButtonElement]"
test[Symbol.toStringTag] //"HTMLButtonElement"
```

## Duck Typing

在程序设计中，Duck Typing（鸭子类型）是动态类型的一种风格。在这种风格中，一个对象有效的语义，不是由继承自特定的类或实现特定的接口，而是由**当前方法和属性的集合**决定。

> 当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。

在鸭子类型中，关注点在于对象的行为（能做什么），而不是关注对象的具体类型。

我们可以编写一个函数，它的参数为一个 Duck 类型的对象，并调用它的"走"和"叫"方法。实际使用时，该函数可以接收任意类型的对象，并调用它的"走"和"叫"方法。如果这些需要被调用的方法不存在，那么将引发一个运行时错误。任何拥有这样的正确的"走"和"叫"方法的对象都可被函数接受。

翻译过来就是，判断一个对象是否是数组，可以看这个对象是否拥有 push()等方法。TypeScript 的类型保护（Type Guard，或者译为类型守卫）就可以使用这种方法来缩小类型范围。
