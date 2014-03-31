---
layout: post
title: "The language Objective-C notes"
description: "Just some language objective-C notes"
tags: [ objective-C ]
category: Other
---
{% include JB/setup %}

###calling method

    [object method];
    [object methodWithInput:input];
    output = [object method];

### define var

    id myObj = [NSString string];
    // pointer type var
    NSString* myStr = [NSString string]; 

###Nested Msg

    [NSString Func1: [Func2]]
    
### multiple method

    - (BOOL) writeFile:(NSString*)path atomically:(BOOL)useXFile;
    BOOL ret = [myData writeFile:@"path" atomically:@"file"];
    
### accessors (getter/setter)

    [Phone setCaption:@"pNmae"];
    output = [Phone caption]; // leave out get prefix

    // we can use dot syntax since oc 2.0
    Phone.caption = @"pName";
    output = Phone.caption

### create obj

    NSString* myStr = [NSString string];
    NSString* myStr = [[NSString alloc] init];
    NSNumber* myNum = [[NSNumber alloc] initWithFloat:1.0];
    
#### memory management

    NSString* str1 = [NSString string];
    NSString* str2 = [[NSString alloc] init];
    [str2 release];

#### Class Interface(Phone.h)

    #import Cocoa
    @interface Phone : NSObjet {
        NSString* str1
        NSString* str2
    }
    // getter
    - (NSString*) str1
    - (NSString*) str2

    // settter
    - (void) setStr1: (NSString*)input;
    - (void) setStr2: (NSString*)input;

    @end

#### Class Implement(Phone.m)

    #import "Phone.h"
    @implementation Phone 

    // getter
    - NSString* str1 {
        return str1 ;
    }
    - NSString* str2 {
        return str2 ;
    }

    //setter
    - (void) setStr1: (NSString*)input {
        [str1 autorelease] ;
        str1 = [input retain];
    }
    - (void) setStr2: (NSString*)input {
        [str2 autorelease] ;
        str2 = [input retain];
        // in garbage collection environment we can set value directly
        // str2 = input ;
    }

    @end

### init

    - (id) init {
        if (self = [super init]){
            [self setStr1:@"string 1"];
            [self setStr2:@"string 2"];
        }
        return self;
    }

### dealloc   

    - (void) dealloc {
        [str1 release]  ;
        [str2 release]  ;
        [super dealloc]  ;
    }

### more memory management
### log
### properties
### categories
### Nil