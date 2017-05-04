//PubSub for connection in modules
var Bus = (function () {
    //{evtName:{cb:[fn, ...], emitted: 0, arg: ...arg}}
    var events = {}
    function on (evtName, cb , now) {
        if (!events[evtName]) {
            events[evtName] = {cb: [], emitted: 0}
        }
        events[evtName].cb.push(cb)

        var event = events[evtName]
        if (event.emitted && now) {
            emit.apply(null, [evtName, ...event.arg])
        }
    }
    function emit(evtName, ...arg) {
        if (!events[evtName]) {
            events[evtName] = {cb: [], emitted: 1, arg: arg}
        }
        var cb = events[evtName].cb
        for (var i = 0, k ; k = cb[i] ; i++ ) {
            if (typeof k == 'function') {
                k.apply(null, arg)
            }
        }
    }
    function off(evtName, cbName) {
        var evt = events[evtName]
        if (!evt) { return  ; }

        //remove all
        if (!cbName) {
            delete events[evtName]
            return  ;
        }

        for (var i = 0, k ; k = evt.cb[i] ; i++ ) {
            if (k.name == cbName) {
                evt.cb.splice(i,1)
                break;
            }
        }
    }

    return { on, off, emit } ;
})();
Bus.on('x', function a(a) {
    console.log(a) ;
})
Bus.on('x', function b(b) {
    console.log('x') ;
})
Bus.off('x', 'b' )

//异步和jsonp组合产生的bug
var V = function () { this.init.apply(this, arguments) };
V.prototype = {
    init: function (arg) {
        this.cfg = {}
        for (var i in arg) { this.cfg[i]= arg[i] }
        var self = this
        window.say = ()=>{
            console.log(this.cfg.name) ;
        }
        //两个实例都会返回beta，因为第二个全局函数被覆盖了
        setTimeout(function () {
            say()
        }, 1000);
    }
}
// var v1 = new V({name: 'alpha'})
// var v2 = new V({name: 'beta'})

var LazyMan = function () { this.init.apply(this, arguments) };
LazyMan.prototype = {
    init: function (name) {
        var self = this
        var fn = function () {
            console.log(name) ;
            self.task.next()
        }
        this.task.push(fn)
        setTimeout(function () {
            self.task.next()
        }, 0);
    },
    task: (function () {
        var q = []
        function push (fn) {
            q.push(fn)
        }
        function next () {
            var fn = q.shift()
            fn && fn()
        }
        return {push,  next} ;
    })(),
    eat: function (food) {
        var self = this
        this.task.push(function () {
            console.log(`Eat ${food}`) ;
            self.task.next()
        })
        return this ;
    },
    sleep: function (t) {
        var self = this
        this.task.push(async function () {

            console.log('sleep') ;
            await sleep(t)
            console.log('wake', t) ;
            self.task.next()
        })
        return this ;
    }
}
function L (name) {
    return new LazyMan(name) ;
}
// L('boby').sleep(2000).eat('b')

function sleep (time) {
    return new Promise(function (resolve, reject) {
        if (time<50) {
            setTimeout(function () {
                reject('not enough')
            }, 50);
        }else {
            setTimeout(resolve, time);
        }
    })
}
async function A (argument) {
    try {
        var ret = await Promise.all([sleep(50), sleep(600)])
        console.log('await OK') ;
        // await sleep(1000)
        // await sleep(50)
    }catch (e){
        console.log('err', e) ;
    }
}
// A()

var count = 0
function divideSearch (arr, key , start, end) {
    //console.log('times:', count++) ;

    start = start || 0
    //下面这个写法有误，以后编码中尽量不要使用这种判断函数变量，因为有可能传过来的参数就是0
    // end = end || (arr.length - 1)

    if (undefined === end) { end = arr.length -1 }

    //bp跟踪变量的正确用法
    //F8断点暂停和继续 此时，看到的变量都是到断点位置时计算出来的，所以第一次以为是数据错误了
    //要正确追踪变量，应该用单步进入F11
    var mid = Math.floor((start + end) /2)
    var mid_v = arr[mid]
    if (key === mid_v) {
        return mid ;
    }
    if (start == end) {
        console.log('not found') ;
        return -1 ;
    }
    if (key > mid_v ) {
        start = mid + 1
        return divideSearch(arr,key , start , end) ;
    }else {
        end = mid - 1
        return divideSearch(arr,key , start , end) ;
    }
}
var testArr = [-11, 11, 22,33,44,55,77,99]
console.log(divideSearch(testArr, 0)) ;


//Sorts
//QuickSort 
var testSortArr = [1,5,0,-11,-33,77, 9, 88];
function quickSort (arr) {
    if (arr.length <= 1) {
        return arr ;
    }
    var mid = Math.floor((arr.length-1)/2)
    //splice会破坏原始数据
    //var mid_v = arr.splice(mid, 1)[0]
    var mid_v = arr[mid]
    var left = [] , right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < mid_v) {
            left.push(arr[i])
        }else if(arr[i] > mid_v){
            right.push(arr[i])
        }
    };
    return [...quickSort(left), mid_v, ...quickSort(right)] ;
    // return quickSort(left).concat(mid_v, quickSort(right)) ;
}
console.log('quick sort,', quickSort(testSortArr)) ;

//BubbleSort O(N^2)
async function bubbleSort (arr, cb) {
    var len = arr.length
    
    //只需要n-1次，最后剩余的一个数就不用排
    for (var i = 0; i < len-1; i++ ) {
        //j<len-1 - i ,要减去已经排好的个数
        for (var j = 0; j < len -1 - i; j++ ) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                await sleep(100) ;
                (typeof cb === 'function') && cb(j, j+1);
            }
        }
    }
    return arr ;
}
// console.log('bubble sort,', bubbleSort(testSortArr)) ;

var alexRand = function (min, max, digit) {
    var r = Math.random()*(max-min) + min ;
    return digit ? Number(r.toFixed(digit)) : (r | 0) ;
};
function createRdmData (argument) {
    var arr = Array(20).fill(0).map( (v,k)=> {
        return alexRand(10, 280) ;
    })
    var elRoot = document.getElementById('sortShow')
    var strHtml = ''
    for (var i = 0 ; i < 20; i++ ) {
        strHtml += '<p style="height:'+arr[i]+'px"></p>'
    }
    elRoot.innerHTML = strHtml
    return arr ;
}
var rmdData = createRdmData();
function swapEl (i,j) {
    var elRoot =document.getElementById('sortShow')
    var elP = elRoot.getElementsByTagName('p')
    elRoot.insertBefore(elP[j], elP[i])
}
function doBubbleSort() {
    var ret = bubbleSort(rmdData, function (i,j) {
        swapEl(i,j)
    })
    console.log(ret) ;
}
doBubbleSort();

//sendBeacon 
var report = function (url, data) {
    var finalUrl = url + data 
    var nsb = window.navigator.sendBeacon
    if (!!nsb) {
        nsb(url)   
    }else {
        //send img load
        var img = new Image()
        img.src = finalUrl 
        //send xhr sync
    }
}
