var slider = function () {
    var elList = document.getElementById('sliderList').getElementsByTagName('li');
    var elNav = document.getElementById('sliderNav').getElementsByTagName('a');
    var defIndex = 0 ;

    //init
    elList[defIndex].style.opacity = '1';
    elNav[defIndex].className = 'on';
    
    for (var i = 0, k ; k = elNav[i] ; i++ ) {
        k.index = i ;
        k.onmouseover = function () {
            elList[defIndex].style.opacity = '0';
            elNav[defIndex].className = '';

            elList[this.index].style.opacity = '1';
            elNav[this.index].className = 'on';
            defIndex = this.index;
        }
    }
};
slider();
