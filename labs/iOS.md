

###type
    弱类型
    () type

###方法调用
    Obj.method()
    [Obj method]

###参数
    method(arg)
    A:B method:arg

obj.method(arg)
[obj method:arg]

##nested 
obj.method(obj2.method2())
[obj method:[obj2 mehtod2]]

#IBOutlet??
@property (nonatomic, weak) IBOutlet UILabel *nameLabel;
@property (attributes) KEYWORD type name;
so IBOutlet is indicator , associate the instances variables with the elements in the storyboard. using this keyword to tell IB that these outlets are allowd to make connection with object in IB

#delegate

Whenever an object needs to perform certain task, it depends on another object to handle it. This is usually known as separation of concern in system design.
