---
title: Python基础学习笔记
date: 2022-07-29T13:28:36.000+08:00
tag: Python
duration: 4min
---

#### 运算

幂运算\*\*

与 `and`

或 `or`

列表含有元素 `in`

列表不含元素 `not in`

#### 流程控制

if...elif...else

判空：if list

#### 数据类型

python 是强类型的动态语言

**字符串** ""'' 拼接用+（非字符串不能直接拼接，用`str()`转换）

**整数** 两个整数运算会舍去小数

**浮点数** 带小数点，同样存在精度问题

**布尔** `False` `True` 条件判断时非空字符串为`True`

##### 列表

`[1，2]`

`list[0]` 索引访问，不能超出长度；负索引，反向访问，访问超出时同样报错

`del list[0]` 删除元素

遍历 `for elm in list:`

**列表解析** `value**2 for value in nums` 表达式+遍历

切片（含头不含尾）

```python
list=[0,1,2,3]
# list[1:2] => [1]
# list[:3] => [0,1,2]
# list[2:] => [2,3]
# list[-2:-1] => [2]
# list[:] => [0,1,2,3] # 复制一份
```

##### 元组

`(10,100)` 不可变 元素不可改，元组引用可以改

##### 字典

`{'color':'blue','points':5}` 键值对

访问元素 `dic['color']`

添加/修改元素 `dic[x_position]=0`

删除元素 `del dic[x_position]`

遍历

##### 集合

列表但无重复元素

#### 变量命名

`变量名=变量值`

字母、数字和下划线

不要将 Python 关键字和函数名用作变量名

#### 函数

`def func_name(arg1,arg2,...)`

位置实参，关键字实参（`func_name(arg1=...)`），默认值(`def func_name(arg1=default)`)，可以指定参数默认值为''，实现可选参数

切片表示法，防止修改原列表 `func_name(list_name[:])`

参数列表 `func_name(*args)` 创建一个名为 args 的空元组，将传入的位置参数全部接收到该元组

`func_name(**args)` 创建一个名为 args 的空字典，将传入的关键字参数全部接收到该元组

#### 模块

`import module_name` 导入所有函数，使用时用`module_name.func_name`

`import module_name *` 复制模块中所有函数，使用时直接用`func_name`

`from module_name import func_name`

`from module_name import func_name as func_alias`

`from module_name import func_0, func_1, func_2`

#### 类

```python
class Dog():
  # 构造函数
  # 开头和末尾各有两个下划线，这是一种约定，旨在避免Python默认方法与普通方法发生名称冲突
  def __init__(self,name) -> None:
    self.name=name
  # 实例方法
  def sit(self):
    print( self.name.title())
  # 方法中的self实参自动传递，必须位于其他形参的前面
  # 每个与类相关联的方法调用都自动传递实参self，它是一个指向实例本身的引用，让实例能够访问类中的属性和方法

dog=Dog('xiaoming')
dog.sit()
```

继承

```python
class Tidy(Dog):
  def __init__(self, name) -> None:
    # super调用
    super().__init__(name)
  def sit(self):
    # 重写方法
    print("tidy's name"+self.name.title())
```

#### 文件

```python
with open('index.js') as file_object:
  print(file_object.read()) # read读取内容
```

关键字`with`在不再需要访问文件后将其关闭，因此不需要调用`close`方法，等同于：

```python
file_object=open('index.js')
print(file_object.read())
file_object.close()
```

`read`方法读取结果末尾多了一个空行。因为 read()到达文件末尾时返回一个空字符串，而将这个空字符串显示出来时就是一个空行。

`windows`系统在文件路径中使用反斜杠（\）而不是斜杠（/）

逐行读取 `for line in file_object`

#### 异常

`try...except...esle`，except 处理具体错误

ZeroDivisionError：除零异常

FileNotFoundError：找不到文件

```python
try:
  print(5/0)
except ZeroDivisionError:
  # print("can't divide zero")
  pass # 不做异常处理
else:
  print("else handle")
```

#### 测试

```python
import unittest
from name import name

class NameTestCase(unittest.TestCase):
  def test_name(self):
    fullname=name('json','mars')
    self.assertEqual(fullname,'json mars')

unittest.main()
```

`setUp()` 用于创建测试方法所需的类实例、变量等

#### 常用函数

`print()` 打印

`range(start,end，step?)` 创建生成一系列的数字，含头不含尾，用于遍历

`input()` 等待输入，参数为提示信息。输入默认得到字符串类型。

`open(filename,mode?)` 打开文件，可指定读取模式（'r'）、写入模式（'w'）、附加模式（'a'）或让你能够读取和写入文件的模式（'r+'）。注意，写入模式会覆盖原有内容，附加模式会追加写入内容。

`close()` 关闭文件读取

##### 类型

`str()` 字符串

`int()` 整数

`double()` 浮点数

`list()` 列表

`set()` 集合

`dict()` 二维数组转字典

##### 字符串

`.title()` 首字母大写

```python
name="aDa wONg"
print(name.title())
# Ada Wong
```

`.upper()` 全大写

`.lower()` 全小写

`.rstrip()` 去除结尾空格

`.lstrip()` 去除开头空格

`.strip()` 去除两端空格

`.replace(old,new)` 替换字符串

`.split()` 按特定字符分割字符串，存储在一个列表中

##### 列表

`.append()` 末尾追加元素

`.insert(idx,elm)` 在对应索引插入元素

`.pop(idx?)` 末尾/idx 处删除元素

`.remove()` 删除**第一个**指定值的元素

`.sort(reverse?)` 按字母排序，`reverse=True`排序后反向

`sorted()` 排序但不改变原数组

`.reverse()` 反向，改变原数组

`len()` 输出长度

##### 字典

`.items()` 获取键值对 `for key,val in dic.items()`

`.keys()` 获取键 `for key,val in dic.keys()`

`.values()` 获取键 `for key,val in dic.values()`

##### 文件对象

`.read()` 读取所有内容

`.readlines()` 读取行内容存储在一个列表中

`.write()` 写入内容，不会在你写入的文本末尾添加换行符。

##### JSON

`.dump(data,filename)` 存储数据到指定文件

`.load(filename)` 加载数据

##### 数学

`min()` 最小值

`max()` 最大值

`sum()` 求和

#### 版本区别

`print`的行为

```python
print "hello"
# py2 正常运行
# py3 报错
```

整数除法

```python
3/2
# py2 1
# py3 1.5
```

input

```python
str=input()
# print("hello")
# py2 将输入作为 python 代码执行，但不能使用input、print函数等
# py3 处理为字符串 == py2 raw_input()
```

类定义

```python
# py2 class ClassName(object):
# py3 class ClassName():
```

类继承

```python
# py2
# class ElectricCar(Car):
#  def __init__(self, make, model, year):
#  super(ElectricCar, self).__init__(make, model, year)

# py3
# class ElectricCar(Car):
#  def __init__(self, make, model, year):
#  super().__init__(make, model, year)
```
