define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'collections/info', 'collections/calculator', 'text!templates/calculator/calculator.html', 'text!templates/calculator/firstLevelListItems.html', 'text!templates/calculator/secondLevelListItems.html', 'text!templates/calculator/thirdLevel.html', 'text!templates/calculator/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionInfo, CollectionCalculator, templateCalculator, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        ul : '.calc_element_template',
        
        // Slider IDs
        sliderContainer : '#sliderProject .slide_container',
        sliderProject : '#slider ul',
        
        // variables
        calcElements: 0,        
        
        templateFirstLevelListItems : '',
        templateSecondLevelListItems : '',
        templateThirdLevel : '',
        templateThirdLevelListItems : '',
        collection: '',
        dataAlreadyExist: false,
        calculatorWidth: '2048', 	// px-Auflösung calc 
        calculatorHeight: '1490', 	// px-Auflösung calc           
        
        events: {
            //"click li"     : "themeClicked",
            "click .calc_navigation_back"     				: "backwardClicked",
            "click .calc_navigation_info"     				: "infoClicked",            
        }, 
        
               
        initialize: function(){           
              
        },

        setCalculator: function() {
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
        
                
        calculatorFirstLevel: function(){    
           // Calc laptop size + aligment
            var deviceWidth = window.innerWidth;
            var deviceHeight = window.innerHeight;
            
            var dW = (deviceWidth/this.calculatorWidth);
            var dH = (deviceHeight/this.calculatorHeight) ;
			var min = Math.min(dW, dH);
            
            var width = ( this.calculatorWidth*min  ) * 0.95; 
            var height = ( this.calculatorHeight*min ) * 0.95;	
        	
        	             
            calcElements=0;

            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems = '';
                        
            // render the view            
            CollectionMenu.each( function(model){                       


                    if(model.attributes.category === 'taschenrechner') {                        
                         
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value, serverUri:model.attributes.server_uri, iconPath:model.attributes.icon_path } );
                            calcElements++;
                              
                        });
                                            
                    }
                  
            });   

          
            // render            
            $(this.el).html( _.template( templateCalculator, {} ));            
            $(this.ul).html( this.templateFirstLevelListItems );
            
			// scale + align laptop container
			var $calc_center_container = $(this.el).find('.calc_center_container');				
            $calc_center_container.css({
                    'width': width+'px',
                    'height': height+'px'
            });            
            
			// center content container 
			if( calcElements <= 3){
				$('.calc_content').css('top', "30%");            
            }
                              
        },
        
        
       calculatorSecondLevel: function(id){
                      
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
                  
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionCalculator();   
                
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
        
        calculatorThirdLevel: function(id, id2){

            // cast string into integer
            id = parseInt(id);
            id2 = parseInt(id2);
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionCalculator();   
                
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
                      that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {project: project, media: Util.splitMedia(value, serverUri, pathSmallPics, pathBigPics)} );
                      
                });             
                
                // render site
                $(this.el).html(Slider.slider2Init());    
                $(this.sliderProject).append(this.templateThirdLevelListItems);  
                Slider.setInfo(pathBigPics, serverUri);
                
                //this.initPageSize();
    
                this.setCalculator();                 
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
		  
		  /* ############## CLICK EVENTS ############## */
		 infoClicked: function(){  
		     var model = CollectionInfo.where({category: "taschenrechner"});
             var locateInfoWrapper = $('#info-wrapper');
             var locateInfoLayer = locateInfoWrapper.find('#info-layer');
             locateInfoLayer.html(model[0].attributes.info);
             var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
             locateInfoClose.show();
             locateInfoWrapper.show();
		 },
		 
		 backwardClicked: function(event){  console.log("zurueck clicked"); }        
        
   
        
    });
    
    return new View();
        
});
