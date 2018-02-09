// 创建自定义对象

// 1. 工厂模型
function createPerson(name, age, job){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.info = function() {
    console.log('工厂：' + this.name + ' ' + this.age + ' ' + this.job);
  }
  return o;
}

var zhao = createPerson('jerome', 25, 'frontEnd');
console.log(zhao.constructor === createPerson); // false
console.log(zhao.constructor === Object); // true
zhao.info(); // 工厂：jerome 25 frontEnd

// 优点：简单，解决了创建多个相似实例的问题
// 缺点：没有解决实例识别问题，创建的实例对象只能是属于 Object，实例对象的 contructor 指向 Object

// 2. 构造函数模型
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.info = function() {
    console.log('构造函数：' + this.name + ' ' + this.age + ' ' + this.job)
  }
}

var jerome = new Person('jerome', 25, 'frontEnd');
var zhu = new Person('zhu', 24, 'backEnd');
jerome.info(); // 构造函数：jerome 25 frontEnd
zhu.info(); // 构造函数：zhu 24 backEnd

console.log(jerome.constructor === Person); // true
console.log(zhu.constructor === Person ); // true

console.log(jerome instanceof Person); // true
console.log(jerome instanceof Object); // true
console.log(zhu instanceof Person); // true
console.log(zhu instanceof Object); // true

console.log(zhu.info === jerome.info); // false 缺点

// 调用构造函数经历下列步骤：
// 1 创建一个新对象;
// 2 将构造函数的作用域赋给新对象（因此this就是指向了这个新的对象）;
// 3 执行构造函数中的代码(为这个新对象添加属性);
// 4 返回新的对象。

// 优点：没有显式创建对象和 return，解决了实例识别问题，实例对象的 contructor 指向构造函数
// 缺点：每次创建一个新的自定义对象都会重新定义新的函数，上例中的 info 函数

// 构造函数与其他函数唯一区别就是调用方式不一样(new 调用)，如果构造函数直接使用和普通的函数一样，只是函数内部的 this 指向了全局对象 window

Person('win', '%', 'global');
console.log(window.info()); // 构造函数：win % global

// 可以使用 call/apply 在某个作用域下调用 Person

var callMan = new Object();
Person.call(callMan, 'callMan', '%', 'test');
callMan.info(); // 构造函数：callMan % test

// 缺点(每次创建一个新的自定义对象都会重新定义新的函数)，可以使用一下方式解决，新创建的实例对象的 info 都是指向全局的 info 函数。
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.info = info;
}

function info() {
  console.log('构造函数：' + this.name + ' ' + this.age + ' ' + this.job);
}
// 考虑到程序的严谨性，在全局定义一个函数只是为了给特定的对象实例显然有点小题大做，这时 prototype 就发挥了作用。

// 注意：创建自定义对象的构造函数，一般使用大写字符开头，例如 Person 的 P

// 3. 原型模式
function Dog() {}
Dog.prototype.name = 'wangcai';
Dog.prototype.age = 1;
Dog.prototype.arr = ['init'];
Dog.prototype.wangwang = function() {
  console.log('wangwang');
};

console.log(Dog.prototype.constructor === Dog); // true

var xiaozhu = new Dog();
var dafei = new Dog();

console.log(xiaozhu.name); // wangcai
console.log(dafei.name); // wangcai
console.log(xiaozhu.age); // 1
console.log(dafei.age); // 1
xiaozhu.wangwang(); // wangwang
dafei.wangwang(); // wangwang

// 直接通过给实例化属性赋值是不会修改原型中的值的
// 但是直接修改原型继承的引用类型属性，会一并修改
xiaozhu.name = 'changed'
console.log(xiaozhu.name); // changed
console.log(dafei.name); // wangcai

xiaozhu.arr[0] = 'changed'
console.log(xiaozhu.arr); // ["changed"]
console.log(dafei.arr); // ["changed"]

// 那问题来了，只是为了共享一个函数，有必要全部共享实例的全部属性吗？不存在的.....

// 4. 组合构造函数和原型

// 利用构造函数的私有化属性，和原型的共享功能，就成为现在最流行的创建自定义实例的模式

function Human(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}

Human.prototype.info = function() {
  console.log('组合构造函数和原型：' + this.name + ' ' + this.age + ' ' + this.job);
}

var jobs = new Human('jobs', 50, 'ss');
var micheal = new Human('micheal', 60, 'dd');

console.log(jobs.name); // jobs;
console.log(micheal.name); // micheal
console.log(jobs.age); // 50
console.log(micheal.age); // 60
console.log(jobs.job); // ss
console.log(micheal.job); // dd
jobs.info(); // 组合构造函数和原型：jobs 50 ss
micheal.info(); // 组合构造函数和原型：micheal 60 dd

// 修改单个实例的私有化属性
jobs.job = '111';
console.log(jobs.job); // 111
console.log(micheal.job); // dd

console.log(jobs.info === micheal.info) // true 两个实例的 info 函数指向同一个函数

// 5. 动态原型模式

// 该模式致力于解决构造函数和原型都独立写的困扰。通过在构造函数中初始化原型（仅在必要的情况下），又保持了同时使用构造函数和原型的优点。

function Human(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;

  // 方法
  if(typeof this.sayName != 'function') {
    Person.prototype.sayName = function() {
      console.log(this.name);
    }
  }
}

// ## prototype 
// 每个函数都包含一个 prototype 属性，这个属性指向一个对象，包含特定类型的所有实例共享的属性和方法，构造函数创建的所有实例对象都共享原理对象的属性和方法。
// function Dog() {}
// Dog.prototype.name = 'wangcai';
// Dog.prototype.age = 1;
// Dog.prototype.wangwang = function() {
//   console.log('wangwang');
// };

// 默认情况下：prototype 包含name，age，wangwang外还包含 constructor 和从 Object 继承而来的属性和方法。
// Dog.prototype.constructor === Dog // true

// 实例化对象是无法访问到 prototype ，但 FireFox、safari 和 Chrome 在每个对象上都支持一个属性 __proto__，用来连接实例对象与原型
// var xiaozhu = new Dog();
// console.log(xiaozhu.prototype) // undefined
// console.log(xiaozhu.__proto__ === Dog.prototype) // true
// 也可以使用 isPrototypeOf() 方法来确定实例对象和某函数原型是否存在这种关系
// console.log(Dog.prototype.isPrototypeOf(xiaozhu)) // true
// Object.getPrototypeOf() 获取到实例的 Prototype 的值
// console.log(Object.getPrototypeOf(xiaozhu) === Dog.prototype)

// 每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。搜索首先从对象实例本身开始。如果在事例中找到了具有给定名字的属性，则返回改属性的值；如果没有找到，则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。
// 给实例对象直接赋予一个从原型中共享来属性，之后再获取同名的属性，将不再是读取原型中值，而是直接读取实例对象中的。使用 delete 删除实例的属性，可以恢复这种共享关系。
// function Dog() {}
// Dog.prototype.name = 'wangcai';
// Dog.prototype.age = 1;
// Dog.prototype.wangwang = function() {
//   console.log('wangwang');
// };

// var dog1 = new Dog();
// var dog2 = new Dog();

// dog1.name = 'Greg';
// console.log(di1.name); // Greg
// console.log(di2.name); // wangcai

// delete dog1.name = 'Greg';
// console.log(di1.name); // wangcai

// 判断属性存在事例中还是原型中，object.hasOwnProperty() 只有属性存在于实例中时才返回 true, in 操作符只要通过对象能访问到属性就能返回 true。
// function hasPrototypeProperty(object, name) {
//    return !object.hasOwnProperty(name) && (name in object); 
//}

// 通过· for - in 和 Object.keys() 可以获取实例的所有可枚举的属性；
// Object.getOwnPropertyNames() 可以获取所有实例属性，无论是否可枚举。

// 1 简单原型链

// 思路：原型对象
function Super() {
  this.val = 'init';
  this.arr = ['init'];
}

function Sub() {}

Sub.prototype = new Super(); // 继承核心语句

var sub1 = new Sub();
var sub2 = new Sub();

console.log(sub1.val); // init
console.log(sub1.arr); // ["init"]
console.log(sub2.val); // init
console.log(sub2.arr); // ["init"]

sub1.val = 'changed';
console.log(sub1.val); // changed
console.log(sub2.val); // init

sub1.arr[0] = 'changed';
console.log(sub1.arr); // ["changed"]
console.log(sub2.arr); // ["changed"]

sub1.arr = [1,2];
console.log(sub1.arr); // [1, 2]
console.log(sub2.arr); // ["changed"]

// 优点：简单，易于实现

// 缺点：继承过来的引用类型数据被共享，执行 `sub1.arr[0] = 'changed'` 同时修改了 sub1.arr 和 sub2.arr 的值;
//      执行`sub1.arr = [1,2]`，不会修改prototype中的值
//      创建子类是历史，无法向父类构造参数传值。