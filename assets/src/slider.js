// 
// projectslider: overall functions
///////////////////////////////////////////////////////
define([
    'jquery', 'jqueryMobile', 'swipe', 'swipeup', 'text!templates/slider/slider.html', 'text!templates/slider/sliderProject.html'
], function($, $$, GetSwipe, SwipeUp, templateSlider, templateSliderProject) {
	
	// Positionierung des Sliders für Projekt Übersicht
	var sliderSet = function() {
		// Init Projektübersicht Slider
		var slider2 = new Swipe(document.getElementById('sliderProject'), {
			callback: count
		});
		
		// Left and Right Slider Arrow 	
		$("a#arrLeftClick_Projects").click(function() {
			slider2.prev();
			return true;
		})
		$("a#arrRightClick_Projects").click(function() {
			slider2.next();
			return true;
		})
	
	    $("#sliderProject a").click(function() {
	    	setTimeout("ImageScale_Slider()", 400);
	    });
	    
	}
	
	// Slider für Projekt Übersicht
	var sliderInit = function(){
		// ruft Slider template slider.html auf
    	return templateSlider;
    };

	// Callback Funktion für sliden des Sliders
	var count = function(event, index, elem){
		var i = index + 1
		$(".counterInner").html("Seite "+i+" von "+listLength);
	}

	// Slider für Projekt
	var slider2Init = function() {
		// ruft Slider Projekt template sliderProject.html auf
		return templateSliderProject;
	}
	
	// Set Slider 2 
	var slider2Set = function() {
	
		// Init Projekt Slider
		var slider = new Swipe(document.getElementById('slider'), {
			callback: count
		});
		
		// Left and Right Slider Arrow 	
		$("a#arrLeftClick_Project").click(function() {
			window.console.log("left")
			slider.prev();
			return true;
		})
		$("a#arrRightClick_Project").click(function() {
			slider.next();
			return true;
		})
		
		// Slider Images in Slider einpassen
		var sliderHeight = $("#slider ul").height();
		var newsliderHeight = sliderHeight  + "px"
		$(".swipeDiv img").height(newsliderHeight);
		
	}
	
    return {
    	sliderInit: sliderInit,
    	sliderSet: sliderSet, 
    	slider2Init: slider2Init, 
    	slider2Set: slider2Set
    };

});