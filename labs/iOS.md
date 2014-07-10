
###IBOutlet

    @property (nonatomic, weak) IBOutlet UILabel *nameLabel;
    @property (attributes) KEYWORD type name;

so IBOutlet is indicator , associate the instances variables with the elements in the storyboard. using this keyword to tell IB that these outlets are allowd to make connection with object in IB


###delegate

Whenever an object needs to perform certain task, it depends on another object to handle it. This is usually known as separation of concern in system design.


###scene
has d dock that make action and outlet between viewController and view
view 和 controller 通信其实是靠viewcontroller来完成的。vc相当于管理v和c的中间层

###segue
manage the transition between two scenes.

tableCell 的identifier要和类中的保持一致

###outlet connection
A get B
- referencing outlet ,view to viewcontroller
将viewcontroller的数据传递给view,比如datasource, delegate

- outlet,  viewcontroller to view
比如，将view中的数据传递给viewcontroller

但是后面的栗子中，label从vc中获取值的时候，却又是从vc指向view的。


    
###show outlet

申明和同步：

    @property (nonatomic, strong) IBOutlet UILabel *recipeName;

    @implementation ...
    @synthesize recipeName;
    
###navigation controller
editor - embed in - nav

###tabar controller
tabar貌似是基于navigation的。要插入tab bar，先选择nav，然后 editor - embeded in - tab (把tab嵌入nav), 体现在流程图上却是：tab - nav

add new tab: drag a nav C (自动关联一个tableviewC）,right click the tab bar and pointer to new navC,select 'relationship - viewC'

###webview
drag a webview to view ,create a class for webView.


###search bar

darg , 

###js

imgRoll 的状态和方法映射到外部
    
    bns.imgRollIndex
   Bns.imgRollPrev()

onscroll
    根据imgroll的index判断当前状态
        如果index++ == 9 then do slidescene(2)
        如果index-- == 8 then do slideScene(1)

