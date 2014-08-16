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

- if, elif, else
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

coming soon.

####dir
####package


###七.Data structure

- list, like Array in JavaScript
- tuple, like list but immutable
- dict, like Json

####Attr and method

####Sequence

###八.OOP

coming soon.

####Classes

####Method

###九.More

coming soon.

####Exception
####IO

