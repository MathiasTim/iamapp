// 
// projectslider: overall functions
///////////////////////////////////////////////////////
define([
    'jquery', 'jqueryMobile', 'jqueryFittext', 'swipe', 'swipeup', 'text!templates/slider/slider.html', 'text!templates/slider/sliderProject.html'
], function($, $$, $$$, GetSwipe, SwipeUp, templateSlider, templateSliderProject) {
	
	info_header: 	'#project_info_header';
	info_icon: 		'#project_info_icon'; 
	info_authors: 	'#project_info_authors'; 
	info_text: 		'#project_info_text'; 
	
	// Positionierung des Sliders für Projekt Übersicht
	var sliderSet = function() {
		
		// Init Projektübersicht Slider
		var slider2 = new Swipe(document.getElementById('sliderProject'), {
			callback: count
		});
		
		// center container
		vinWidth = $("body").width();
		vinHeight = $("body").height();
		pageWidth = vinHeight * 1.3 + "px";
		var pageHeight = vinHeight + "px";
		
		// count slider length
		listLength = $("#sliderProject li").length;
		
		// set container width and height
		$(".slider_page").css("width", pageWidth)
		$(".slider_page").css("height", pageHeight)
		
		// set Slider Img width
		sliderWidth = $("#sliderProject").width();
		$("#sliderProject img").css("width", sliderWidth / 4.5);
		$("#sliderProject img").css("height", sliderWidth / 4.5);
		
		// Left and Right Slider Arrow 	
		$("a#arrLeftClick_Projects").click(function() {
			slider2.prev();
			return true;
		})
		$("a#arrRightClick_Projects").click(function() {
			slider2.next();
			return true;
		})
		$(".descrInner").fitText(3.5);
		//setTimeout(function() { $(".descrInner").fitText(3.5) }, 10);
	}
	
	// Slider für Projekt Übersicht
	var sliderInit = function(){
		// ruft Slider template slider.html auf
    	return templateSlider;
    };

	// Callback Funktion für sliden des Sliders
	var count = function(event, index, elem){
		var i = index + 1
		//$(".counterInner").html("Seite "+i+" von "+listLength);
		
		/*$(".vimeo-player").each(function() {
			var vimeo_src = $(this).attr("src");
			$(this).parent().html('<iframe class="vimeo-player" src="'+ vimeo_src + '" width="80%" height="350px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
		}); */
		
		$(".youtube-player").each(function() {
			var youtube_src = $(this).attr("src");
			if (window.innerHeight < 440) {
				$(this).parent().html('<iframe class="youtube-player" type="text/html" width="80%" height="200px" src="' + youtube_src +'" frameborder="0"></iframe>');
			}
			else {
				$(this).parent().html('<iframe class="youtube-player" type="text/html" width="80%" height="350px" src="' + youtube_src +'" frameborder="0"></iframe>');
			}
		});
	}

	// Slider für Projekt
	var slider2Init = function() {
		// ruft Slider Projekt template sliderProject.html auf
		return templateSliderProject;
	}
	
	var sliderPageSize = function() {
		// center container
		vinWidth = $("body").width();
		vinHeight = $("body").height();
		pageWidth = vinHeight * 1.3 + "px";
		var pageHeight = vinHeight + "px";
		
		// count slider length
		listLength = $("#sliderProject li").length;
		
		// set container width and height
		$(".slider_page").css("width", pageWidth)
		$(".slider_page").css("height", pageHeight)
		
		// set Slider Img width
		sliderWidth = $("#sliderProject").width();
		
		$("#sliderProject img").css("width", sliderWidth / 3.7);
	}
	
	// Set Slider 2 
	var slider2Set = function() {
		// Init Projekt Slider
		var slider = new Swipe(document.getElementById('slider'), {
			callback: count
		});
		
		// center container
		vinWidth = $("body").width();
		vinHeight = $("body").height();
		pageWidth = vinHeight * 1.3 + "px";
		var pageHeight = vinHeight + "px";
		
		// count slider length
		listLength = $("#sliderProject li").length;
		
		// set container width and height
		$(".slider_page").css("width", pageWidth)
		$(".slider_page").css("height", pageHeight)
		
		// set Slider Img width
		sliderWidth = $("#sliderProject").width();
		$("#sliderProject img").css("width", sliderWidth / 3.7);
		
		// Left and Right Slider Arrow 	
		$("a#arrLeftClick_Project").click(function() {
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
		
		$("#projectGallery").live('swipeup',function() {
            $("#overlay_projectinfo").fadeIn();
	    });
	    
	    $("#overlay_projectinfo").live('swipedown',function() {
	    	$("#overlay_projectinfo").fadeOut();
	    });
	    
	    $("#sliderOverlay_back").click(function() {
	    	$("#overlay_projectinfo").fadeOut();
	    });
	    
	    $("#slider_info").click(function() {
	    	$("#overlay_projectinfo").fadeIn();
	    });
		
		$("#slider_moreinfo").click(function() {
	    	$("#overlay_projectinfo").fadeIn();
	    });

	}
	
	// Set Slider Info 
	var setInfo = function(pathBigPics, serverUri) {
		var info_header = 	$(".project_info_hidden_header").html();
		var info_author = 	$(".project_info_hidden_author").html();
		var info_text = 	$(".project_info_hidden_text").html();
		var info_icon = 	$(".project_info_hidden_icon").html();
		var info_date = 	$(".project_info_hidden_date").html();
		
		$("#profect_info_header").html(info_header);
		$("#project_info_text").html(info_text);
		$("#profect_info_authors").html(info_author);
		$(".descrInner").html(info_header);
		$("#project_info_icon").html("<img src='"+serverUri+pathBigPics+info_icon+"'>");
	}
	
    return {
    	sliderInit: sliderInit,
    	sliderSet: sliderSet, 
    	slider2Init: slider2Init, 
    	slider2Set: slider2Set, 
    	sliderPageSize: sliderPageSize, 
    	setInfo: setInfo
    };

});