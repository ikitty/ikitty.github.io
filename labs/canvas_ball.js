(function (win) {
    win.RAF = (function(){
        return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback) {win.setTimeout(callback, 1000 / 60); };
    })();
    win.CAF = function(render) {
        var _caf = win.cancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame || win.msCancelRequestAnimationFrame        || clearTimeout ;
        _caf(render._timer);
    };
    win.LoopRAF = function (render) {
        (function _loop(){
            render();
            render._timer = RAF(_loop); 
        })();
    };
})(window);

function getRandSymbol () { return Math.random() > 0.5 ? 1 : -1 ; }
var alexRand = function (min, max, digit) {
    var r = Math.random()*(max-min) + min ;
    return digit ? Number(r.toFixed(digit)) : (r | 0) ;
};

//===========
//start move up
//===========
var canvasMoveUp = (function(){
    var canvas = document.getElementById("canvasBall"),
        dw = canvas.clientWidth,
        dh = canvas.clientHeight,
        ctx = canvas.getContext('2d'),
        colorArr = [ 
            ['rgb(253,250,25)', 'rgb(255,187,4)'] , //lightGold
            ['rgb(255,69,204)', 'rgb(207,59,143)'],  //pink
            ['rgb(79,250,255)', 'rgb(24,174,255)'] , //blue
            ['rgb(180,212,67)', 'rgb(84,142,4)'],  //green
            ['rgb(255,197,37)', 'rgb(216, 137, 43)'] , //darkGold
        ] ,
        Balls = []
        ;

    canvas.setAttribute('width', dw);
    canvas.setAttribute('height', dh);

    //Ball Class
    var Ball = function( x , y , vx , vy, color  ){
        this.uid = 'id_'+  ((Math.random()*1000000) | 0);
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = alexRand(10,40);
        this.color1 = color[0];
        this.color2 = color[1];

        var gradient=ctx.createLinearGradient(this.x - this.r, this.y-this.r, this.x+this.r, this.y+ this.r);
        gradient.addColorStop("0", this.color1);
        gradient.addColorStop("1.0", this.color2);
        this.color = gradient ;
    }
    Ball.prototype = {
        paint:function(changeColor){
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.arc(this.x , this.y , this.r , 0  , Math.PI*2);

            var gradient=ctx.createLinearGradient(this.x - this.r, this.y-this.r, this.x+this.r, this.y+ this.r);
            gradient.addColorStop("0", this.color1);
            gradient.addColorStop("1.0", this.color2);

            ctx.fillStyle = gradient ;
            ctx.lineWidth = 2
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        },
        destroy: function () {
            for (var i = 0, k ; k = Balls[i] ; i++ ) {
                if (k.uid ===this.uid) {
                    Balls.splice(i, 1);
                    break;
                }
            }
        },

        move:function(){
            this.x += this.vx;
            this.y += this.vy;

            if (this.x + this.r > dw || this.x < this.r || this.y < this.r ) {
                this.destroy();
                console.log('clean');
            }
            this.paint();
        }
    }

    var originBoxW = 300;
    var originBoxH = 100;
    var ballControl = {
        maxNum: 5
        ,init:function(){
            for(var i=0;i<this.maxNum;i++){
                var b = new Ball( alexRand((dw-originBoxW)*.5, (dw+originBoxW)*.5) , alexRand(dh-originBoxH, dh) , getRandSymbol()*alexRand(1 , 2) ,  -1*alexRand(1 , 5) , colorArr[i] )
                Balls.push(b);
            }
        }
        ,planAddBall: 0
        ,update:function(){
            var self = this;
            if (Balls.length < this.maxNum && !this.planAddBall ) {
                this.planAddBall = 1 ;
                setTimeout(function () {
                    var last = self.maxNum - Balls.length ;
                    for (var i = 0 ; i < last; i++ ) {
                        var b = new Ball( alexRand((dw-originBoxW)*.5, (dw+originBoxW)*.5) , alexRand(dh-originBoxH, dh) , getRandSymbol()*alexRand(1 , 1) ,  -1*alexRand(1 , 5) , colorArr[alexRand(0,4)] );
                        Balls.push(b);
                    }
                    self.planAddBall = 0 ;
                }, 500);
            }
            for(var i=0;i<Balls.length;i++){
                Balls[i].move();
            }
        }
    }

    var totalControl = {
        init: function () {
            ballControl.init();
            this.play();
        }
        ,update:function(){
            ctx.clearRect(0,0,dw, dh);
            ballControl.update();
        }
        ,play: function () {
            LoopRAF(this.update);
        }
        ,pause: function () {
            CAF(this.update);
        }
    };
    return totalControl ;
})();
canvasMoveUp.init();

//===========
//start many balls and collision
//===========
var canvasBallCollision = (function(){
    var canvas = document.getElementById("canvasCollision"),
        dw = canvas.clientWidth,
        dh = canvas.clientHeight,
        ctx = canvas.getContext('2d'),
        colorArr = [ 
            ['rgb(253,250,25)', 'rgb(255,187,4)'] , //lightGold
            ['rgb(255,69,204)', 'rgb(207,59,143)'],  //pink
            ['rgb(79,250,255)', 'rgb(24,174,255)'] , //blue
            ['rgb(180,212,67)', 'rgb(84,142,4)'],  //green
            ['rgb(255,197,37)', 'rgb(216, 137, 43)'] , //darkGold
        ] ,
        Balls = [],
        Sharps = [],
        Foods = [] ;

    canvas.setAttribute('width', dw);
    canvas.setAttribute('height', dh);

    var collisionCal = function (obj1, obj2, cb) {
        var dx = obj2.x - obj1.x ;
        var dy = obj2.y - obj1.y ;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var minDist = obj1.r + obj2.r ;
        if (dist <= minDist) { 
            cb && cb(dx, dy, minDist);
        }
    };
    var collisionDetect = function () {
        for (var i = 0, k, le = Balls.length ; i < le; i++ ) {
            var ballA = Balls[i];
            //detect collision between ball and food
            for (var food_i = 0; food_i < Foods.length; food_i++ ) {
                collisionCal(ballA, Foods[food_i], function () {
                    Foods.splice(food_i--, 1);
                    ballA.r+=2;
                    ballA.r > 50 && (ballA.r = 50) ;
                });
            }
            //detect collision between ball and sharp
            for (var si = 0; si < Sharps.length; si++ ) {
                collisionCal(ballA, Sharps[si], function () {
                    Sharps.splice(si--, 1);
                    ballA.r-=3;
                    ballA.r < 10 && (ballA.r = 10) ;
                });
            }

            //detect with other balls
            for (var ii = i+1, kk; ii < le; ii++ ) {
                var ballB = Balls[ii];
                collisionCal(ballA, ballB, function (dx, dy, minDist) {
                    var angle = Math.atan2(dy, dx);
                    //刚好相碰时，tx = ballB.x
                    tx = ballA.x + Math.cos(angle)*minDist ;
                    ty = ballA.y + Math.sin(angle)*minDist ;

                    //但是，球仍然在运动,ax记录是的碰撞后运动的值
                    ax = (tx - ballB.x) * 0.09;
                    ay = (ty - ballB.y) * 0.09;

                    ballA.vx -= ax;
                    ballA.vy -= ay;
                    ballB.vx += ax;
                    ballB.vy += ay;
                });
            }
        }
    };

    //Ball Class
    var Ball = function( x , y , vx , vy, color  ){
        this.uid = 'id_'+  ((Math.random()*1000000) | 0);
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = alexRand(10,40);
        this.color1 = color[0];
        this.color2 = color[1];

        var gradient=ctx.createLinearGradient(this.x - this.r, this.y-this.r, this.x+this.r, this.y+ this.r);
        gradient.addColorStop("0", this.color1);
        gradient.addColorStop("1.0", this.color2);

        this.color = gradient ;
    }
    Ball.prototype = {
        paint:function(changeColor){
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.arc(this.x , this.y , this.r , 0  , Math.PI*2);

            var gradient=ctx.createLinearGradient(this.x - this.r, this.y-this.r, this.x+this.r, this.y+ this.r);
            gradient.addColorStop("0", this.color1);
            gradient.addColorStop("1.0", this.color2);

            ctx.fillStyle = gradient ;
            ctx.lineWidth = 2
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        },
        destroy: function () {
            for (var i = 0, k ; k = Balls[i] ; i++ ) {
                if (k.uid ===this.uid) {
                    Balls.splice(i, 1);
                    break;
                }
            }
        },

        move:function(){
            this.x += this.vx;
            this.y += this.vy;

            //complex collision
            var changeColor = 0 ;
            if(this.x>(canvas.width-this.r)||this.x<this.r){
                this.x=this.x<this.r?this.r:(canvas.width-this.r);
                this.vx = -this.vx;
                changeColor = 1;
            }
            if(this.y>(canvas.height-this.r)||this.y<this.r){
                this.y=this.y<this.r?this.r:(canvas.height-this.r);
                this.vy = -this.vy;
                changeColor = 1;
            }
            collisionDetect();

            this.paint(changeColor);
        }
    }
    var originBoxW = 300;
    var originBoxH = 100;
    var ballControl = {
        maxNum: 5
        ,init:function(){
            for(var i=0;i<this.maxNum;i++){
                var b = new Ball( alexRand((dw-originBoxW)*.5, (dw+originBoxW)*.5) , alexRand(dh-originBoxH, dh) , getRandSymbol()*alexRand(1 , 2) ,  getRandSymbol()*alexRand(1 , 3) , colorArr[i] )
                Balls.push(b);
            }
        }
        ,planAddBall: 0
        ,update:function(){
            var self = this;
            if (Balls.length < this.maxNum && !this.planAddBall ) {
                this.planAddBall = 1 ;
                setTimeout(function () {
                    var last = self.maxNum - Balls.length ;
                    for (var i = 0 ; i < last; i++ ) {
                        var b = new Ball( alexRand((dw-originBoxW)*.5, (dw+originBoxW)*.5) , alexRand(dh-originBoxH, dh) , getRandSymbol()*alexRand(1 , 2) ,  getRandSymbol()*alexRand(1 , 2) , colorArr[alexRand(0,4)] );
                        Balls.push(b);
                    }
                    self.planAddBall = 0 ;
                }, 500);
            }
            for(var i=0;i<Balls.length;i++){
                Balls[i].move();
            }
        }
    }

    //Food Class
    var Food = function(){
        this.x = alexRand(10, dw-10);
        this.y = alexRand(10, dh-10);
        this.r = alexRand(3, 7);
        this.color ="rgba("+alexRand(0,255)+","+alexRand(0,255)+","+alexRand(0,255)+",1)";
    }
    Food.prototype = {
        paint:function(){
            ctx.beginPath();
            ctx.fillStyle = this.color ;
            ctx.arc(this.x , this.y , this.r , 0  , Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    };


    //Sharp Class, it will devide the ball 
    var Sharp = function(){
        var pad = 80 ;
        this.x = alexRand(pad, dw-pad);
        this.y = alexRand(pad, dh-pad);
        this.r = alexRand(8, 12);
        this.color ="rgba("+alexRand(100,255)+","+alexRand(0,155)+","+alexRand(50,200)+",1)";
    }
    Sharp.prototype = {
        paint:function(){
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0,0,0)'
            ctx.arc(this.x , this.y , this.r , 0  , Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    };
    var sharpControl = {
        maxNum: 3
        ,init: function () {
            for(var i=0;i<this.maxNum;i++){
                Sharps.push(new Sharp());
            }
        }
        ,planAddSharp: 0
        ,update: function () {
            var self = this;
            if (Sharps.length < this.maxNum && !this.planAddSharp ) {
                this.planAddSharp = 1 ;
                setTimeout(function () {
                    var last = self.maxNum - Sharps.length ;
                    for (var i = 0 ; i < last; i++ ) {
                        Sharps.push(new Sharp());
                    }
                    self.planAddSharp = 0 ;
                }, 1000);
            }
            for(var i=0;i<Sharps.length;i++){
                Sharps[i].paint();
            }
        }
    };

    var foodControl = {
        maxNum: 5
        ,planAddFood: 0
        ,init: function () {
            for(var i=0;i<this.maxNum;i++){
                Foods.push(new Food());
            }
        }
        ,update: function () {
            var self = this;
            if (Foods.length < this.maxNum && !this.planAddFood ) {
                this.planAddFood = 1 ;
                setTimeout(function () {
                    var last = self.maxNum - Foods.length ;
                    for (var i = 0 ; i < last; i++ ) {
                        Foods.push(new Food());
                    }
                    self.planAddFood = 0 ;
                }, 500);
            }
            for(var i=0;i<Foods.length;i++){
                Foods[i].paint();
            }
        }
    };


    var totalControl = {
        init: function () {
            ballControl.init();
            foodControl.init();
            sharpControl.init();
            this.play();
        }
        ,update:function(){
            ctx.clearRect(0,0,dw, dh);
            ballControl.update();
            foodControl.update();
            sharpControl.update();
        }
        ,play: function () {
            LoopRAF(this.update);
        }
        ,pause: function () {
            CAF(this.update);
        }
    };
    return totalControl ;
})();

canvasBallCollision.init();
