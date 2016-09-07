---
layout: post
title: "Cocos notes"
description: "Just notes"
tags: [cocos]
category: Other
---
{% include JB/setup %}

仅仅是流水账式的问题集

###问题：

    error MSB8020: The builds tools for v120 (Platform Toolset = 'v120') cannot be found. To build using the v120 build tools, either click the Project menu or right-click the solution, and then select "Update VC++ Projects

解决：右击项目 - 属性 - 常规 - 平台工具集，选择vs2012 v110 


###加载tiledMap

tmap新建是默认使用csv格式的，但是cocos2dx读取csv格式的tmap时，会报错（类似nullpointer错误），解决办法是：新建地图时选择压缩的base64编码。

###tiledmap的问题

不能使用多个图块填充同一个图层，如果这样做了，那么程序只好识别最后一个填充的图块。这可能会导致背景显示异常。

    加载地图时弹出断言失败窗口,跟踪进去发现崩毁地点:
    
    CCAssert( m_uMaxGID >= m_pTileSet->m_uFirstGid &&
        m_uMinGID >= m_pTileSet->m_uFirstGid, "TMX: Only 1 tileset per layer is supported");
    从断言中的提示就可以看出:一张图层上只支持一个一个图块集合
    就是说编辑器中的每一层只能使用一个图块集合中的图块,不能使用其他图块集合中的图块!
    
###cpp头文件中的类声明

    #include ".."
    //这里是大写哦
    Class X;
    class Y {
        virtual void doSth(X* x);
    }

这里的Class X类似include X.h， 区别，编译时不会报错找不到这个类。一般用在头文件中，如果只是申明某个函数的参数，那么，就不需要包含整个头文件，只需要使用Class 声明这个类即可。如果include 了整个头文件，当X类变化时，包含了X的类都需要重新编译。简化版的申明则不会受到影响。

但是，当需要对一个类实例化，或者要用到其函数的时候就需include头文件。比如案例中的cpp文件用到了x类的函数，所以在其cpp文件中还是要include头文件的。
    


###在一个工程包含多项目避免重复编译
 
新建一个项目，进入项目文件夹，只保留classes，resources，proj.win32三个文件夹，其余的删除。然后把该项目文件夹剪切到之前的项目中，并在之前的解决方案中添加现有项目，选择新项目文件夹中的vcxproj文件即可。 然后选中这个项目，右键设置为启动项目，就可以调试了。 （如果运行时报错，记得在属性中修改平台工具集为vs2012）

###场景

场景继承于node，是一个包含各种layer sprite 并且继承了物理引擎的壳子
场景切换replaceScene和pushScene，前者释放场景，后者只是暂停场景，不会释放。pushScene和popScene成对使用

###glview

appdelegate中设置的glview的size只是针对windows上debug。


###精灵

三个基类，ref，node，layer

###数据类型

- Value(1).asString();
- vector
- map

###lambda函数

    []（）{}
    [&](arg){body}

- `[]`中间为&表示街区外部作用于的所有变量，局部变量不可以使用，因为他可以被释放
- `[]`中间为=，表示copy外部所有变量，即使外部变量变化了，lambda里面仍是变化前的值

###std::tring和c_str的区别

- std::string是cocos里面的类，具有oo的优点，c_str是c风格的字符串，前者封装了后者
- 转换 const char* cstr = string.c_str();

###引入第三方库的要点

- 头文件引入
- 在解决方案右键添加现有项目，在源码中的目录找到vcxproj文件
- 在项目属性-通用属性，添加新引用勾选对应的引用


###事件处理

注册事件监听后，系统会把listener对象放到一个列表，事件触发后，便利列表调用listener里面监听的callback

    //事件吞没（阻止捕获）
    listener->setSwallowTouches(true);

如果事件被吞没后，后面的事件就不会被触发了。
 

###定时器

    //std::map 和 Map是不同的，Map是std::map的封装，Map不能直接放Vector对象的。
    ValueVector等价于std::vector<Value>，因为vector不能直接存储Value，所用要用std::vector
    
    std::function<void(Ref*)> 表示参数为Ref，返回为void的函数
    

###Lua

- lua堆栈有正向和负向索引，栈底的索引是1（依次递加），栈顶的索引是-1（依次递减）
- lua_getglobal实际上包含了四个步骤，将变量放在栈顶，lua去栈顶获取变量，lua去全局表查找变量，lua把变量值放回栈顶。
- lua调用cpp的函数和封装的函数必须是static的


###快捷键

- 注释 c-k， c-c
- 取消注释 ck，cu
- 在h和cpp文件中切换：alt + o （需要va支持）
