var pn = 0;
var d = 1;

function MotionEventRegister() {
	$(window).resize(function() {
		$('body').css('width',$(window).width()).css('height',$(window).height());
	});
	$('#page0').removeClass('status2').addClass('status1');

	$(window).mousewheel(function(event, delta, deltaX, deltaY) {
		status = $('body').attr('class');
		if (status != 'playing') {
			if(deltaY<0){
				motion(1);
			}else{
				motion(-1);
			}
            $('#navigation li').removeClass('page_on').eq(pn).addClass('page_on');

            $('body').addClass('playing');
            setTimeout(function() {$('body').removeClass('playing')}, 1300);
		}
	});
	document.onkeydown = function(event) {
		var c = window.event.keyCode;
		if (c==40||c==32||c==39) {
			motion(1);
		}else if (c==38||c==37) {
			motion(-1);
		}
        $('#navigation li').removeClass('page_on').eq(pn).addClass('page_on');
	}
}
function motion(d){
	pn = pn + d;

	if (pn == 0) {
		$('.page0_round').css('display','block');
	}else{
		// $('.page0_round').css('display','none');
	};

	if (pn==-1) {
		pn = 0;
	}else if (pn==5) {
		$('#page4').removeClass('status1').addClass('status0');
		$('#page0').css({'display':'block','opacity':'0'});
		setTimeout(function(){$('#page0').css('opacity','1').removeClass('status0').addClass('status1');}, 100);
		pn = 0;
        motion(0);
	}
	if (d!=0) {
		$('#bg'+(pn-d)).css('opacity','0');
	}else {
		$('#bg div').css('opacity','0');
	};
    $('#bg'+(pn)).css('opacity','1');

	$('#page'+pn).removeClass('status2').removeClass('status0').addClass('status1');
	$('#page'+(pn-1)).removeClass('status1').addClass('status0');
	$('#page'+(pn+1)).removeClass('status1').addClass('status2');

	$('#track').removeClass('page0').removeClass('page1').removeClass('page2').removeClass('page3').removeClass('page4').addClass('page' + pn);
}
//run
$(document).ready(function(){
    MotionEventRegister();
    motion(0);
});
