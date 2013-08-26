### Animate Div with Mouse Direction

之前看到Jb分享了一个“鼠标跟随”的特效Demo，研究了下。里面用到了JavaScript和CSS3的动画技术。该特效的核心在于如何判断鼠标进入图片区域的方向，该代码的精华都蕴含在下面这一句中：

    var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180 ) / 90 ) + 3 )  % 4;
    // var direction =  Math.round( Math.atan2(y, x) / (Math.PI/2) + 5 ) % 4

利用了高数中的三角函数来判断鼠标进入的方向。下面将上述代码拆开分析：

    var w = box.offsetWidth;
    var h = box.offsetHeight;
    // 将鼠标进入时和矩形的切入点在平面直角坐标平面中表示出来, x和y分别是切入点的x轴坐标和y轴坐标。这样鼠标切入点和矩形中点会形成一个夹角。
    // (w > h ? (h/w): 1) 用来将矩形修正为正方形，以避免矩形宽高不一致影响到角度
    var x=(e.clientX - box.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
    var y=(e.clientY - box.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);

比如鼠标从左侧进入到矩形区域，对应的切入点坐标。图中鼠标切入的点和真实计算出点的坐标是基于x轴对称的，但是依然会在同一个角度区域。

    //TODO IMG

计算切入点坐标的反正切值，其值域为[-PI, PI]，并将所得结果转换成角度

    var direction ;
    direction = Math.atan2(y, x) * (180 / Math.PI);

前面提到了反正切的值域，为了方便后续转换，这里再加上180度，将结果范围转换为0-360度之间的值

    direction = direction + 180;

正切函数关于点(kπ/2,0)对称 （k∈Z）,所以加上180度不会对结果有影响。
    // todo IMG 正切函数图


平面直角座标系分为四个象限，如图：
    // TODO IMG 象限图

将度数转换为象限值
    direction = direction / 90;
这里通过加3，并对4取余，以将结果修正为我们期待的结果：{Top:0, Right: 1, Bottom: 2, Left: 3}
    direction = Math.round(direction + 3) % 4;


以上就是获取鼠标方向的全过程解析。有了该方法，只需要监控鼠标在矩形区域上的mouseenter/mouselveave事件，并实时的把半透明浮层的跟随动画添加上即可，这部分交给css3来搞定即可。
动画代码：
    // code
