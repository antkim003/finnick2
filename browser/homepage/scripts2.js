var sizes = {
	xl : 1280,
	l : 1120,
	m : 960,
	s : 800,
	xs : 640
};
var isActive = false;

setSize = function(ww){
	console.log('setSize('+ww+')', ww);
	if(ww <= sizes.xs){
		$('body').attr('size', 'xs');
	}else{
		setIsotope();
	}
	if((ww > sizes.xs) && (ww <= sizes.s)){
		$('body').attr('size', 's');
	}
	if((ww > sizes.s) && (ww <= sizes.m)){
		$('body').attr('size', 's');
	}
	if((ww > sizes.m) && (ww < sizes.l)){
		$('body').attr('size', 'm');
	}
	if((ww >= sizes.l) && (ww < sizes.xl)){
		$('body').attr('size', 'l');
	}
	if(ww >= sizes.xl){
		$('body').attr('size', 'xl');
	}
}

function setIsotope(){
	if (isActive == false) {
		$('#tile-container').isotope({
			percentPosition: true,
			itemSelector: '.tile',
			//		layoutMode : 'fitColumns'
			masonry: {
				gutter: 0,
				fitWidth: false
			}
		});
		isActive = true;
		console.log('ISOTOPE SET')
	}
}

function toggleInfo(elem){
	// 1. Toggle view of panel informaiton
	var toggleText = elem.find(".copy-wrap")

	console.log(toggleText);

	toggleText.animate({
		height : "toggle"
	}, 500, function(){
		
	});
}

function circlePopulate(){
	// 1. Create array of sections that use circles
	var circleSections = ['women', 'shoes', 'juniors', 'forthehome', 'bedandbath'];
	
	// 2. Loop through all sections and find ones that use circles
	$(".tile").each(function(i, val){
		var tile = $(val);

		if(circleSections.indexOf(tile.attr("fob")) !== -1){
			// 3. Remove first two lines from section text and populate circles
			
			var circle = tile.find(".circle"),
			text = tile.find(".copy-wrap"),
			circleContent = text.find(".line-1, .line-2");

			circle.html(circleContent);
			text.find(".line-1, .line-2").remove();
		}
	});
}

$(document).ready(function(){
	if(ImpSdk.util.getDevice().device == 'mobile'){
		$('body').addClass('mobile');
	}

	$(".half-tile").on("click", function(){
		toggleInfo($(this));
	});

	setSize( $(window).width() );	

	circlePopulate();
});



$(window).resize(function(){
	setSize( $(window).width() );	
	
	if($(window).width() <= sizes.xs){
		if (isActive) {
			$('#tile-container').isotope('destroy');
			isActive = false;
		}
	}else{
		setIsotope()
	}
	
});