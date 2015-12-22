var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || 
							function(callback) { setTimeout(callback, 1000 / 60); };
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

//0-init、1-start、2-stop、3-pause、4-continue

var SnowMod = function (arg) {
    var cfg = {
        maxCount: 100
        ,sliceSize: 10
        ,fallSpeed: 5
        ,ctx: null
    };
    for (var i in cfg) {
        this[i] = arg[i] || cfg[i] ;
    }
    this.status = 0;	
}

SnowMod.prototype = {
    start: function () {
        if(this.status == 1 || this.status == 4){
            return false;
        }
        this.status = 1;

        this.createSnowCanvas();
        this.createSnowSlice();
        this.runSnow();
    }
    ,stop: function () {
        if(this.status == 2 || this.status == 0 || !this.canvas){
            return false;
        }
        this.pause();
        this.status = 2;
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
    }
    ,createSnowCanvas: function () {
        var snowcanvas = document.createElement("canvas");
        snowcanvas.id = "snowfall";
        snowcanvas.width = window.innerWidth ;
        snowcanvas.height = window.innerHeight ;
        snowcanvas.setAttribute("style", "position:fixed;top: 0px;left:0px;z-index: 100;pointer-events: none;");
        document.getElementsByTagName("body")[0].appendChild(snowcanvas);
        this.canvas = snowcanvas;
        this.ctx = snowcanvas.getContext("2d");
        window.onresize = function() {
            snowcanvas.width = window.innerWidth ;
            snowcanvas.height = window.innerHeight;
        }
    }
    ,createSnowSlice: function () {
        var maxCount = this.maxCount,
            sliceArr = this.sliceArr = [],
            canvas = this.canvas;
        for (var i = 0; i < maxCount; i++) {
            sliceArr.push(new SnowSlice(canvas.width, canvas.height, this.sliceSize, this.fallSpeed))
        }
    }
    ,pause: function () {
        if(this.status == 3){
            return false;
        }
        this.status = 3;
        cancelAnimationFrame(this.snowAnim)
    }
    ,resume: function () {
        if(this.status == 3 && this.canvas){
            this.status = 4;
            var me = this;
            this.snowAnim = requestAnimationFrame(function() {
                me.runSnow();
            });
        }
    }
    ,runSnow: function () {
        var maxCount = this.maxCount,
            sliceArr = this.sliceArr;
        var ctx = this.ctx,
            canvas = this.canvas ;

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.width;
        for (var e = 0; e < maxCount; e++) {
            sliceArr[e].update();
            sliceArr[e].render(ctx);
        }
        var me = this;
        this.snowAnim = requestAnimationFrame(function() {
            me.runSnow();
        });
    }
};


/**
 * snow prototype
 *
 **/
function SnowSlice(canvasWidth, canvasHeight, sliceSize, fallSpeed) {
    this.canvasW = canvasWidth;
    this.canvasH = canvasHeight;
    this.x = Math.floor(Math.random() * canvasWidth);	
    this.y = Math.floor(Math.random() * canvasHeight);	
    this.size = Math.random() * sliceSize + 2;			
    this.maxSize = sliceSize;							
    this.speed = Math.random() * 1 + fallSpeed;			
    this.fallSpeed = fallSpeed;							
    this.velY = this.speed;								
    this.velX = 0;										
    this.stepSize = Math.random() / 30;					
    this.step = 0 									
}

SnowSlice.prototype = {
    update: function () {
        var x = this.x,
            y = this.y;

        this.velX *= 0.98;
        if (this.velY <= this.speed) {
            this.velY = this.speed
        }
        this.velX += Math.cos(this.step += .05) * this.stepSize;

        this.y += this.velY;
        this.x += this.velX;
        if (this.x >= this.canvasW || this.x <= 0 || this.y >= this.canvasH || this.y <= 0) {
            this.reset()
        }
    }
    ,reset: function () {
        this.x = Math.floor(Math.random() * this.canvasW);
        this.y = 0;
        this.size = Math.random() * this.maxSize + 2;
        this.speed = Math.random() * 1 + this.fallSpeed;
        this.velY = this.speed;
        this.velX = 0;
    }
    ,render: function (ctx) {
        var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
        snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.save();
        ctx.fillStyle = snowFlake;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
};


window.addEventListener('DOMContentLoaded', function () {
	var chrisSnow = new SnowMod({maxCount:20});
    chrisSnow.start();
},false);
