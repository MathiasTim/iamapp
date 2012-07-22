define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider',  'collections/menu', 'collections/info', 'collections/laptop', 'text!templates/laptop/laptop.html', 'text!templates/laptop/firstLevelListItems1.html', 'text!templates/laptop/firstLevelListItems2.html','text!templates/laptop/secondLevelListItems.html', 'text!templates/laptop/thirdLevel.html', 'text!templates/laptop/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionInfo, CollectionLaptop, templateLaptop, templateFirstLevelListItems1, templateFirstLevelListItems2, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
        
        el: '#main', // target 
        divFolder : '.lpt_folders',
        divMenu : '.lpt_menu2',                
        
        // variables
        menu1: false,
        menu2: false,
        busy1: false,
        busy2: false,
        dataAlreadyExist: false,
        laptopWidth: '2048', 	// px-Auflösung Laptop 
        laptopHeight: '1490', 	// px-Auflösung Laptop        
                
        events: {
            "click .lpt_taskbar_start"     			: "showMenu1",
            "click .lpt_text_menu1_projekt"     	: "showMenu2",
                      
            "click .lpt_text_menu1_info"     		: "infoClicked",                                    
            "click .lpt_text_menu1_shutdown"     	: "backwardClicked",        
			"click .lpt_text_menu1_shutdown" 		: "lpt_resetTimeout",            
        }, 
        
        
        initialize: function(){
                                     
        },
       


/////////////

          laptopFirstLevel: function(){                 
            
            
            // Calc laptop size + aligment
            var deviceWidth = window.innerWidth;
            var deviceHeight = window.innerHeight;
            
            var dW = deviceWidth/this.laptopWidth;
            var dH = deviceHeight/this.laptopHeight;
			var min = Math.min(dW, dH);
            
            var width = this.laptopWidth*min - 20; // padding!
            var height = this.laptopHeight*min - 20;	
			var offsetTop = deviceHeight - height ; // bound to bottom
            
                 
            camElements=0;       
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems1 = '';
            this.templateFirstLevelListItems2 = '';
            
                        
            // render the view            
            CollectionMenu.each( function(model){                       

                    if(model.attributes.category === 'laptop') {                        
                                                                       
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems1 += _.template(templateFirstLevelListItems1, { value: value, serverUri:model.attributes.server_uri, iconPath:model.attributes.icon_path } );
                            that.templateFirstLevelListItems2 += _.template(templateFirstLevelListItems2, { value: value } );
                              
                        });                                      
                    }    
            });  

            // render            
            
            $(this.el).html( _.template( templateLaptop, {} ));            
            $(this.divFolder).html( this.templateFirstLevelListItems1 );
            $(this.divMenu).html( this.templateFirstLevelListItems2 );
             
			// scale + align laptop container
			var $lpt_center_container = $(this.el).find('.lpt_center_container');			
			if ( deviceHeight > 0.75*deviceWidth ){
				$lpt_center_container.css({ 
					'top': offsetTop+ 'px'
				});
			}		
            $lpt_center_container.css({
                    'width': width+'px',
                    'height': height+'px'
            });
            this.lpt_setTime();
                
            // fit text atributes       
       		$(".lpt_text_ordner").fitText(0.5);
       		$(".lpt_menu1").fitText(1.1);
       		$(".lpt_menu2").fitText(1.1);    
      		$(".lpt_taskbar_menu").fitText(1.0);       		
    		$(".lpt_taskbar_time").fitText(1.0); 
                              
        },
        
        
       laptopSecondLevel: function(id){
                      
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
                  
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionLaptop();   
                
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
                this.renderSecondLevel(id);
            }             
            
        },
        
        
        renderSecondLevel: function(id){

                 var that = this;   
                 this.templateSecondLevelListItems = ''; 
                 
                 // Counter SliderContainer
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
                 
                 // render Medien Slider
            	 $(this.el).html(Slider.sliderInit());    
                
                 // render                     
                 $(this.sliderContainer).html(that.templateSecondLevelListItems);
            	 
            	 $(this.el).append(Slider.sliderPageSize());	 
            	 
            	 $(this.el).append(Slider.sliderSet());
            
        },
         
        laptopThirdLevel: function(id, id2){
            
            // cast string into integer
            id = parseInt(id);
            id2 = parseInt(id2);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // find the entry
            var project = this.collection.where({id: id});

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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {media: Util.splitMedia(value, serverUri, pathSmallPics, pathBigPics)} );
                  
            });             
            
            // render site
            
			$(this.el).html(Slider.slider2Init());    
            $(this.sliderProject).append(this.templateThirdLevelListItems);	 
            Slider.setInfo(pathBigPics, serverUri);
           
			$(this.el).append(Slider.sliderPageSize());	 
            	 
            $(this.el).append(Slider.slider2Set());	 
			$(this.el).append(Slider.setInfo(pathBigPics, serverUri));
        },      
        


        getAllMenuItems: function(){
            console.log('getAllMenuItems -- laptop.js');
            return CollectionMenu.models;
        }, 
       
        showMenu1 : function(event){
            
			console.log("Start clicked" + this.busy1);
			if( !this.busy1){
			  if(!this.menu1){ 						// OPEN MENU#1 ///////////////////
				this.menu1 = true;	
				this.busy1 = true;
				var that = this;
				window.setTimeout( function(event){ // prevent jumping - disable interaction for 400ms 
			 		  that.busy1 = false; 
			 		  console.log("Menu1 Opened");
		 		}, 400);			
				$(".lpt_menu1").animate({			// animate menu1 opening
					  top: '0%',
					  easeout: "100",
					  opacity: 1,
					}, 400, "swing" 
                );                        				
			  } 
			  
			  else{ 							  	// CLOSE MENU#1 //////////////////
				this.menu1=false;
				this.showMenu2();	
				this.busy1 = true;
				var that = this;
				window.setTimeout( function(event){ 
			 		  that.busy1 = false; 
			 		  console.log("Menu1 Closed");
		 		}, 400);							
				$(".lpt_menu1").animate({			
    				  top: '100%',
    				  easeout: "100",
    				  opacity: 0,
    				}, 400, "swing" 
    			);
			  }
			}	    
        },
        
        showMenu2 : function(event){
            
			  //console.log("Projektarbeiten clicked");
			 if( !this.busy2){ 
			  if(!this.menu2 && this.menu1){		// OPEN MENU#2 ///////////////////				
				this.menu2 = true;
				this.busy2 = true;
				var that = this;
				window.setTimeout( function(event){ 
			 		  that.busy2 = false; 
			 		  console.log("Menu2 Opened");
		 		}, 400);				
				$(".lpt_menu2").animate({			
				  right: '0%',
				  easeout: "100",
				  opacity: 1,
				}, 400, "swing" );
				
				
			 } else if(this.menu2 || !this.menu1){	// CLOSE MENU#2 ///////////////////	
				this.menu2 = false;
				this.busy2 = true;
				var that = this;
				window.setTimeout( function(event){ 
			 		  that.busy2 = false; 
			 		  console.log("Menu2 Closed");
		 		}, 400);								
				$(".lpt_menu2").animate({
				  right: '100%',
				  easeout: "100",
				  opacity: 0,
				}, 400, "swing" );
			  }	
			 }
		  },
		  
		  
        lpt_setTime: function(){ 
            var that = this;
            var $lpt_time = $('.lpt_taskbar_time');
            
            var lpt_now = new Date();
            var lpt_day = lpt_now.getDay();
            var lpt_day_txt = "Mi.";
            switch (lpt_day) {
				case 1: lpt_day_txt = "Mo."; break;      
				case 2: lpt_day_txt = "Di."; break;            	
				case 3: lpt_day_txt = "Mi."; break;            	
				case 4: lpt_day_txt = "Do."; break;            	
				case 5: lpt_day_txt = "Fr."; break;            	
				case 6: lpt_day_txt = "Sa."; break;     
				case 0: lpt_day_txt = "So."; break;            		      	
            }            
            var lpt_hours = lpt_now.getHours();
            var lpt_minutes = lpt_now.getMinutes();
            var lpt_hours = ((lpt_hours < 10) ? "0" + lpt_hours : lpt_hours);
            var lpt_minutes = ((lpt_minutes < 10) ? "0" + lpt_minutes : lpt_minutes);
            $lpt_time.html(lpt_day_txt + " " + lpt_hours + ":" + lpt_minutes);
            
            this.timeout = setTimeout(function(){
                    that.lpt_setTime();
                }, 60000);
        },
        
        lpt_resetTimeout: function(){
            clearTimeout(this.timeout);
        },		  
		  
		  
		  /* ############## CLICK EVENTS ############## */

		 infoClicked 			: function(event){  
		     var model = CollectionInfo.where({category: "laptop"});
             var locateInfoWrapper = $('#info-wrapper');
             var locateInfoLayer = locateInfoWrapper.find('#info-layer');
             locateInfoLayer.html(model[0].attributes.info);
             var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
             locateInfoClose.show();
             locateInfoWrapper.show();
		 },
		 backwardClicked 		: function(event){  console.log("zurueck clicked"); }
		 

        
    });
    
    return new View();
        
});
