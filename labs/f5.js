(function (window) {
    var refresh = {
        h: location.href
        ,createBtn: function () {
            if (!document.getElementById('testRefresh')) {
                var el = document.createElement('a');
                el.setAttribute('id', 'testRefresh') ;
                el.style.cssText = 'position:absolute;z-index:100000;left:10px;top:100px;width:50px;height:50px;border-radius:15%;background-color:rgba(0,0,0,0.78);color:#fff;font:400 16px/50px tahoma;text-align:center;text-decoration:none;letter-spacing:1px;';
                el.innerHTML = 'F5';
                el.href = this.h ;
                document.body.appendChild(el) ;
                return el ;
            }
        }

        ,S: window.localStorage
        ,distance: [25, 25]
        ,finalPos: {}

        ,setCss: function (el, x, y, isStart) {
            if (isStart) {
                var styleObj = getComputedStyle(el, null)
                    ,orgX = parseInt(styleObj.left)
                    ,orgY = parseInt(styleObj.top)
                    ;
                this.distance = [x - orgX , y-orgY];
            }

            this.finalPos = {x: x - this.distance[0], y: y-this.distance[1]};
            this.finalPos.x = Math.min(Math.max(0, this.finalPos.x), window.innerWidth - 50);
            this.finalPos.y = Math.min(Math.max(0, this.finalPos.y), window.innerHeight -50);
            el.style.left = this.finalPos.x + 'px';
            el.style.top = this.finalPos.y + 'px';
        }
        ,init: function () {
            var el = this.createBtn()
                ,self = this
                ,pos = JSON.parse(this.S.getItem('AlexRefresh'));
                ;
            if (pos) {
                el.style.left = pos.x + 'px';
                el.style.top = pos.y + 'px';
            }
            
            el.addEventListener('touchstart', function (e) {
                self.setCss(el, e.touches[0].pageX, e.touches[0].pageY, 1);
            }, false);
            el.addEventListener('touchmove', function (e) {
                self.setCss(el, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                e.preventDefault();
            }, false);
            el.addEventListener('touchend', function (e) {
                self.S.setItem('AlexRefresh', JSON.stringify(self.finalPos));
            }, false);
        }
    }
    refresh.init();
})(window);
