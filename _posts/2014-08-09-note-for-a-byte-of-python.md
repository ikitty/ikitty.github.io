---
layout: post
title: "Note for A byte of Python"
description: " First of all, thanks so much to Swaroop for A byte of Python book, it's really a excellent guide on Python. Python is a dynamic interpreted language. Due to open-source nature, it has been ported to many platforms."
category: Python
tags: [python]
---
{% include JB/setup %}

###Introduction

First of all, thanks so much to Swaroop for A byte of Python book, it's really a excellent guide on Python. Python is a dynamic interpreted language. Due to open-source nature, it has been ported to many platforms.

here are some notes should be attention as a beginner:

###一.varaible 

python support literal variable, such as you can use `my_list = [1,2]` define a list variable quickly. String is immutable. there are 3 type to specify strings, single quotes, double quotes and triple quotes. Triple quotes coule be used for specify multi-line strings, and you can use single quotes and double quotes within that. So we don't need to use backslash to escape quotes in quotes. nice feature.

####parse varible in string?

In php, we can use variable in string with double quotes directly. but in python, we should use string.format instead. such as :

    name=nick
    age=18
    print 'my age is {0}, age is {1}'.format(name, age) 
    #you can use another type
    print 'my age is %s, age is %d' % (name, age)
    
in fact , format is powerful and useful:

    #make float 
    print '{0:.3f}'.format(1.0/3) # 0.333
    #expand string
    print '{0:_^11}'.format('hello') # ___hello___

####string method

- `in`, substring in string
- `find`, str.find(sub)
- `join`, ''.join(list)
    
###二.Format

Most programing language use semicolon (`;`) to indicate the end of a statement. But Python encourages the use of single statemeng perline which makes code more readable. That idea means that we should never use semicolon.

but if you have a longline of code, you can break it into mutil-line by using the backslash(like break long string in JavaScript):

    s = 'this is a long\
    string '
    #this is a long string

####Indentation

Indentation is very important, Python parser check code block by indentation (we dont use `{}` to indicate code block). Generally we suggest use 4 spaces for indentation.


###三.Operator

- `not` (in js , we can use `!`)
- `and` (in js , we can use `&&`)
- `or` (in js , we can use `||`)
- `*` operator can be used for string, tuple and dict. nice!

###四.Control Flow

- if, elif, else. you can write them in one line `value_when_true if condition else value_when_false`
- while, break, continue
- for, for i in data. data could be range(1,10), string, list, dict.

###五.Functions

####scope

Javascript doesnot support block scope, Python do it well:

    #Javascript case:
    var g = 1
    function fn(){
        g = 2
        //g: 2
        console.log(g)
    }
    fn();
    //g: 2
    console.log(g)

    #Python case:

    #global var
    g=1
    def fn():
        #local var
        #we changed value of g, this won't change global var
        g=2
        print g #2
    fn()
    print g #1

sometimes we want to modify global var in function, we can use `global`:

    #global var
    g = 1
    def fn():
        global g
        g = 2
        print g #2
    fn()
    print g #2

####default arguments

wen can given a default value for arguments in function, by that we dont need to check whether a argument is Undefined before using it:

    def repeatStr(s, times = 2):
        print s*times

    repeatStr('hi')
    repeatStr('hi', 5)
    
####Keyword arguments

If you have function with more arguments and you just want to specify only one of them, you can give values by naming them, and dont worry about the order of arguments. It's really useful, exactly.

    def keyArg(a,b=0,c=0):
        print a, b, c
    keyArg(b=2,a=3)

####varArg parameters

If our function arguments is dynamic, we can use stars:

    def varArg(i, *num, **key):
        #10
        print i 
        #(1,2,3)
        print num
        #{a,b}
        print key

    varArg(10,1,2,3,a=1,b=2)

###六.Modules

Module is good for code reuse.

####__name__

`__name__` can be used for figuring out whether the module runned standalone or being imported. and we can use it to test single module:

    if __name__ == '__main__':
        testA()
    else:
        print 'the module runned by imported'

####package

Want to organize modules? A package has coming. It's just a folders of modules with a `__init__.py` file that tells python the folder is special for modules. Package could be nested.

###七.Data structure

####list [1,2]

Just like Array in JavaScript, list items has an order, and can be mutable. supproted method:

- append
- len
- sort, but we'd better use `sorted` instead
- `del list[index]`
- use `[index]` access specify item

####tuple (1,2)

Like list but immutable, use parenthese instead of square brackets. Although parenthese is optional, we always using it.

####dict {key: value}

like Json, couples of key and value

- items, a list with tuples which include key and value. be useful in `for in` statement
- iteritems,a itemiterator object memory address, but taken similar effect in `for in`.. to be confirm.
- keys
- values
- del

show case:

    #get value by key
    D = {'age': 25, 'name': 'darven'}
    for key,value in D.items():
        if  value == 25:
            print key

####Sequence

String, list, tuple mentioned sequence and can slice specify part of them. items and their indexs:
    
      l=['a', 'b', 'c']
          1    2    3
          -3   -2   -1

    l[startPos: endPos] #notice endPos not including item in end postion

slice operation provice another arguments -- step:

    L = [1,2,3,4]
    print L[::2] # [1,3]
    print L[::3] # [1,4]
    print L[::-1] # [4,3,2,1], similar with inverse

####References

the variable for object only points to memory which object is stored.

    l = [1,3,5]
    ll = l 
    print ll
    del[0]
    # ll has been affected
    print ll

to avoid that, we can make a copy :

    l = [1,3,5]
    ll = l[:]
    print ll
    del[0]
    # ll remains init values
    print ll

###八.OOP

Self -- a variable refers to itself in class

####Classes

    class Person:
        #class inited, __init__ runned
        def __init__(self, name):
            print name, 'has beed inited'
            self.name = name
        def say(self):
            print 'hi', self.name

    p = Person('jack')
    p.say()
    
####Data: Class var and Object var

Class var are shared -- they can be accessed by all instances of Class, if one instance changed a Class var, other instance of Class will seen this change. Object var owned by each instance of Class. Each object has one copy.

**one exception, adding double underscore prefix to class var, this var will be private.**

    class Toy:
        #class var
        count = 0
        #if you want to have a private var ,you cau add special prefix: __private

        def __init__(self, name):
            #name is object var
            self.name = name 
            # here use className as prefix
            # also, we can use : self.__class__.count +=1
            Toy.count +=1

        def gone(self):
            print self.name, 'gone'
            # here use className as prefix
            Toy.count -=1

        @classmethod
        def howmany(cls):
            print 'class count is: ', cls.count

    toy1 = Toy('aa')
    toy2 = Toy('bb')
    Toy.howmany()
    toy1.gone()
    Toy.howmany()

####Inheritance

the purpose of inheritance is reuse of code. It's not easy to create a well superclass.

    class Girl:
        def __init__(self,name):
            self.name = name
            print name, 'inited'
        def show(self):
            print 'name is: %s ' % self.name

    #notice ,specify base class in a tuple following the subclass name
    #python support multiple inheritance
    class Beautygirl(Girl):
        def __init__(self,name, leg):
            #notice: using self to call init of base class
            #python doesnot call consturctor of base class
            Girl.__init__(self, name)
            self.leg = leg
            print 'beautygirl inited named:', self.name
        def show(self):
            #python look for method by chain
            Girl.show(self)
            print 'my leg is: %s ' % self.leg

    bg1 = Beautygirl('michelle', 'white, long')
    bg1.show()

###九.More

####IO

use `raw_input` to interactive with user

    inputs = raw_input('what do you want?\n')
    if  inputs in ['money', 'girl', 'happy']:
        print 'good idea'
    else:
        print 'you wanna :', inputs

write file

    text = 'hi guys'
    f = open(file, 'w')
    f.write(text)
    f.close()

file operation mode can be read(`r`), write(`w`) and append(`a`)

Also, we can use `pickle` module to store/load plain Python object. It's handy for saving user data.

    import pickle

    #in write and binary mode
    f = open('./temp.data', 'wb' )
    pickle.dump(mymod.D, f)
    f.close()

    f = open('./temp.data', 'rb' )
    getData = pickle.load(f)
    print getData

`unicode` type can solve multiple characters problem. and we need to convert unicdoe string into a format that can be sent or received. the format calls `UTF-8`.

    import io
    f = io.open('./text_cn.txt', 'at', encoding = 'utf-8')
    f.write(u'origin ascii code, \u8000\u8001')
    f.close()
    print  io.open('./text_cn.txt',  encoding = 'utf-8').read()

####Exception

    try:
        inputs = raw_input('what do you want?\n')
    except (KeyboardInterrupt, EOFError):
        print 'keyboardInterrupt or eofError'
    else:
        print inputs
    finally:
        print 'finally print, you will see it whatever'

####with

similar with `try finally`

    with open('./test.txt') as f:
        for line in f:
            print line
