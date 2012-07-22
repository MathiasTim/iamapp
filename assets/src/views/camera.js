define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'collections/info', 'collections/camera', 'text!templates/camera/camera.html', 'text!templates/camera/firstLevelListItems.html', 'text!templates/camera/secondLevelListItems.html', 'text!templates/camera/thirdLevel.html', 'text!templates/camera/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionInfo, CollectionCamera, templateCamera, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
          
    var View = Backbone.View.extend({
        
        el: '#main', // target 
        div : '.cam_display_content',
        
        // Slider IDs
        sliderContainer : '#sliderProject .slide_container',
        sliderProject : '#slider ul',
        
        // variables
		mState : 0,  
        camElements: 0,        
		SliderPos: 0,
        dataAlreadyExist: false,
        busy1: false,        
        cameraWidth: '2048', 	// px-Auflösung calc 
        calculatorHeight: '1490', 	// px-Auflösung calc         
        
        events: {
 
            "click .cam_button_info"     			: "infoClicked",
            "click .cam_button_up"     				: "upClicked",
            "click .cam_button_down"     			: "downClicked",
            "click .cam_button_power"     			: "backwardClicked",

                                           
        }, 
        
        
        initialize: function(){
                                     
        },
        
        setCamera: function() {
            var winWidth;   
            var winHeight;
            
            vinWidth = $("body").width();
            vinHeight = $("body").height();
            pageWidth = vinHeight * 1.3 + "px";
            
            $("#zb_page").css("width", pageWidth)
            
            var linkCount = $("#drawings_links a").length;
            var linkWidth = $("#drawings_links").width();
            
            linkWidth = linkWidth - (linkCount * 2)
            
            linkWidth = linkWidth / linkCount - (linkWidth * 0.03);
            
            $("#drawings_links img").css("width", linkWidth)
        },   
                
          cameraFirstLevel: function(){                 
           // Calc laptop size + aligment
            var deviceWidth = window.innerWidth;
            var deviceHeight = window.innerHeight;
            
            var dW = (deviceWidth/this.cameraWidth);
            var dH = (deviceHeight/this.calculatorHeight) ;
			var min = Math.min(dW, dH);
            
            var width = ( this.cameraWidth*min  ) * 0.95; 
            var height = ( this.calculatorHeight*min ) * 0.95;	            
            
            camElements=0;       
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());

            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems = '';
                        
            // render the view            
            CollectionMenu.each( function(model){                       

                    if(model.attributes.category === 'camera') {                        
                                                                       
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value, serverUri:model.attributes.server_uri, iconPath:model.attributes.icon_path  } );
                            camElements++;
                              
                        });
                                            
                    }
                  
            });   

          
            // render            
            
            $(this.el).html( _.template( templateCamera, {} ));            
            $(this.div).html( this.templateFirstLevelListItems );
            
			// scale + align laptop container
			var $calc_center_container = $(this.el).find('.cam_center_container');				
            $calc_center_container.css({
                    'width': width+'px',
                    'height': height+'px'
            });                            
            
            mState = 4; 
			SliderPos = 0;
                    
       		$(".cam_display_content").fitText(2.5);
                              
        },
        
        
       cameraSecondLevel: function(id){
           
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
                  
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionCamera();   
                
                // just fetch the data from the server once         
                this.collection.fetch({
                    
                    success: function(collection) {
                        
                        that.renderSecondLevel(id);
                        that.dataAlreadyExist = true;  
                        
                    },
                    
                    error: function(){
                        console.log('something went wrong --> fetching data failed');
                    }
                    
                }); 
                
            } else {
                //alert('camera exists');
                this.renderSecondLevel(id);
            }             
             
            
        },
        
        renderSecondLevel: function(id){

                 var that = this;   
                 this.templateSecondLevelListItems = ''; 
                 
                 var i = 0;
                 
                 // loop 
                 this.collection.each( function(model){                       
           		
                    if(model.get('id') === id){  
                    	
	                // Counter SliderContainer
	                var i = 0;		
	           		that.templateSecondLevelListItems += "<li>";     
           		
                        var subId = 0;
                        
                        _.each(model.attributes.projects, function(value){ 
                              that.templateSecondLevelListItems += _.template(templateSecondLevelListItems, { value: value, serverUri:model.attributes.server_uri, iconPath:model.attributes.big_pics, id:id, subId:subId++ } );                     
	                        
	                        i++;
	                        if (i == 6) {
	                        	that.templateSecondLevelListItems += "</li><li>";
	                        	i = 0;
	                        }
                        });  
                        
              			that.templateSecondLevelListItems += "</li>";
                    }
                  
                 });                             
                                   
                 
                 // render MediaSlider
            	 $(this.el).append(Slider.sliderInit());   
            	 
            	 // render                     
                 $(this.sliderContainer).append(that.templateSecondLevelListItems);
            	  
            	 $(this.el).html(Slider.sliderPageSize());

            	 
            	 $(this.el).append(Slider.sliderSet());
            
        },
        
        
        cameraThirdLevel: function(id, id2){
            
            // cast string into integer
            id = parseInt(id);
            id2 = parseInt(id2);
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionCamera();   
                
                // just fetch the data from the server once         
                this.collection.fetch({
                    
                    success: function(collection) {
                        
                        that.renderThirdLevel(id, id2);
                        that.dataAlreadyExist = true;  
                        
                    },
                    
                    error: function(){
                        console.log('something went wrong --> fetching data failed');
                    }
                    
                }); 
                
            } else {
                this.renderThirdLevel(id, id2);
            }
            
            
        },
        
        renderThirdLevel: function(id, id2){
            
            // find the entry
            var project = this.collection.where({id: id});
            
            if(typeof(project[0])!="undefined"){
                // pathes
                var pathBigPics = project[0].attributes.big_pics;
                var pathSmallPics = project[0].attributes.small_pics;
                var serverUri = project[0].attributes.server_uri;
                // find the project
                project = project[0].attributes.projects[id2];    
                
                // clear templates
                this.templateThirdLevel = '';
                this.templateThirdLevelListItems = '';
                
                // unique data   
                this.templateThirdLevel += _.template(templateThirdLevel, {project: project} );            
                
                // fyi:
                // by convention, we make a private 'that' variable. 
                // 'this' is used to make the object available to the private methods
                var that = this;
                 
                // media loop                  
                _.each(project.media, function(value){ 
                      //console.log(Util.splitMedia(value));                  
                      that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {project: project, media: Util.splitMedia(value, serverUri, pathSmallPics, pathBigPics)} );
                });             
                
                // render site
                
                $(this.el).html(Slider.slider2Init());    
                $(this.sliderProject).append(this.templateThirdLevelListItems);  
                //this.initPageSize();
    
                Slider.setInfo(pathBigPics, serverUri); 
                this.setCamera();  
                $(this.el).append(Slider.slider2Set());  
            } else {
                var locateInfoWrapper = $('#info-wrapper');
                var locateInfoLayer = locateInfoWrapper.find('#info-layer');
                locateInfoLayer.html("sorry, keine Inhalte gefunden");
                var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
                locateInfoClose.show();
                locateInfoWrapper.show();
            }
        },      
        
        

        
        getAllMenuItems: function(){
            return CollectionMenu.models;
        },
        
        
        updateState : function( state ){
			
			if( !this.busy1){			
				if ( state == "down" && mState < camElements){
					//window.console.log("DOWN mState"+ mState + " maxElem"+camElements+ " Pos"+ SliderPos );					
					mState++;
					SliderPos -= 25;
					this.animate( SliderPos );
				}
				
				else if ( state == "up" && mState > 4){
					//window.console.log("UP mState"+ mState + " maxElem"+camElements+ " Pos"+ SliderPos );					
					mState--;
					SliderPos += 25;
					this.animate( SliderPos );
				}	
				this.busy1 = true;
				var that = this;
				window.setTimeout( function(event){ // prevent autoscrolling - disable interaction for 400ms 
			 		  that.busy1 = false; 
			 		  console.log("slide animation done");
		 		}, 400);					
			}			
									          
        },         
           
        animate : function( pos ){

			// theme animation
			$(".cam_display_content")
			 .animate({
			  top: pos+"%",
			  easeout: "100",
			}, 400, "swing" );					 		              
        },    
        
		
		upClicked 			: function(event){  console.log("up clicked");  this.updateState("up");},
		downClicked 		: function(event){  console.log("down clicked");  this.updateState("down");},
		
		infoClicked 		: function(event){  
		    var model = CollectionInfo.where({category: "camera"});
            var locateInfoWrapper = $('#info-wrapper');
            var locateInfoLayer = locateInfoWrapper.find('#info-layer');
            locateInfoLayer.html(model[0].attributes.info);
            var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
            locateInfoClose.show();
            locateInfoWrapper.show();
		},
		backwardClicked 	: function(event){  console.log("backward clicked"); },
		theme1Clicked 		: function(event){  console.log("theme1 Mensch/Emotion clicked"); },
		theme2Clicked 		: function(event){  console.log("theme2 Natur/Landschaft clicked"); },
		theme3Clicked 		: function(event){  console.log("theme3 Still/Architektur clicked"); },
		theme4Clicked 		: function(event){  console.log("theme4 Abstrakt/Experminetell clicked"); },
		theme5Clicked 		: function(event){  console.log("theme5 Composing/Digiart clicked"); },
		theme6Clicked 		: function(event){  console.log("theme6 Sonstiges clicked"); },
        
    });
    
    return new View();
        
});
