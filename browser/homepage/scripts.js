var sizes = {
	xl : 1280,
	l : 1120,
	m : 960,
	s : 800,
	xs : 640
};
var isActive = false;
var $isoContainer = $('#tile-container');


setSize = function(ww){
	console.log('setSize('+ww+')', ww);
	if(ww <= sizes.xs){
		$('html').attr('size', 'xs');
	}else{
		setIsotope();
		
	}
	if((ww > sizes.xs) && (ww <= sizes.s)){
		$('html').attr('size', 's');
	}
	if((ww > sizes.s) && (ww <= sizes.m)){
		$('html').attr('size', 's');
	}
	if((ww > sizes.m) && (ww < sizes.l)){
		$('html').attr('size', 'm');
	}
	if((ww >= sizes.l) && (ww < sizes.xl)){
		$('html').attr('size', 'l');
	}
	if(ww >= sizes.xl){
		$('html').attr('size', 'xl');
	}
}

function setIsotope(){
	
	sizeTiles();
	
	if (isActive == false) {
		$('#tile-container').imagesLoaded(function(){
			console.log('imagesLoaded')
			console.log('tiles sized');
			$('#tile-container').isotope({
				percentPosition: false,
				itemSelector: '.tile',
				masonry: {
					gutter: 0,
					fitWidth: false
				}
			});
			console.log('ISOTOPE SET')
			isActive = true;
		});
	}
		
		
		
}

function circlePopulate(){
	// 1. Create array of sections that use circles
	var circleSections = ['women', 'shoes', 'juniors', 'forthehome', 'bedandbath'];
	
	// 2. Loop through all sections and find ones that use circles
	$(".tile").each(function(i, val){
		var tile = $(val);

		if(circleSections.indexOf(tile.attr("fob")) !== -1){
			// 3. Remove first two lines from section text and populate circles
			text = tile.find(".copy-wrap");
			circleContent = text.find(".line-1, .line-2");
			tile.prepend(circleContent);
			circleContent.wrapAll('<div class="circle"></div>');
		}
	});
}

function sizeTiles(){
	
	console.log('-----------------');
	
	
	$('html[size] .tile.home-tile').each(function(i,e){
		var thisTileFob = $(e).attr('fob');
	
		var thisTileWidth = $(e).outerWidth();
		var thisTileCopyHeight = $(e).children('.copy-wrap').outerHeight();
		
		var newHeight = thisTileWidth+thisTileCopyHeight;
		
		console.log(thisTileFob, newHeight);
		
		
		
		if(($(e).attr('tall') == 'true' ) && (isActive == true)){
			$(e).height((newHeight*2)+30);
		}else{
			$(e).height(newHeight);
		}
		
	})
}


$(document).ready(function(){
	if(ImpSdk.util.getDevice().device == 'mobile'){
		$('html').addClass('mobile');
	}
	setSize( $(window).width() );
	circlePopulate();
});



$(window).resize(function(){
	setSize( $(window).width() );	
	
	if($(window).width() <= sizes.xs){
		if (isActive) {
			$('#tile-container').isotope('destroy');
			isActive = false;
			console.log('ISOTOPE KILL')
		}
	}else{
		setIsotope()
	}
	
});