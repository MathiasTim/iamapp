function setSmartphone() {
				var vinWidth = $("body").width();
				var vinHeight = $("body").height();
				var pageWidth = vinHeight * 1.35 + "px";
				
				$("img.full").css("height", vinHeight * 0.944);
				$("#smartphone_page").css("width", pageWidth);
				var rowCount = $('#smartphone_links div').length;
				
				//var percent = 100 - rowCount ;
				//percent = percent - (rowCount * 2) - 5;
				
				//var rowWidth = (percent / rowCount + "%");
				// $("#smartphone_links div").css("width", rowWidth);
}	

define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'collections/info', 'collections/smartphone', 'text!templates/smartphone/smartphone.html', 'text!templates/smartphone/firstLevelListItems.html', 'text!templates/smartphone/secondLevelListItems.html', 'text!templates/smartphone/thirdLevel.html', 'text!templates/smartphone/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionInfo, CollectionSmartphone, templateSmartphone, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        div : '#smartphone_links',
        
        // Slider IDs
        sliderContainer : '#sliderProject .slide_container',
        sliderProject : '#slider ul',
        
        templateFirstLevelListItems : '',
        templateSecondLevelListItems : '',
        templateThirdLevel : '',
        templateThirdLevelListItems : '',
        collection: '',
        dataAlreadyExist: false,

        events: {
            "click .smartphone_info"     : "info",
            "click .smartphone_impressum" : "impressum",
        }, 
               
        initialize: function(){           
              
        },
        
        info: function() {
            var model = CollectionInfo.where({category: "smartphone"});
            var locateInfoWrapper = $('#info-wrapper');
            var locateInfoLayer = locateInfoWrapper.find('#info-layer');
            locateInfoLayer.html(model[0].attributes.info);
            var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
            locateInfoClose.show();
            locateInfoWrapper.show();
        },
        
        impressum: function() {
            var model = CollectionInfo.where({category: "impressum"});
            var locateInfoWrapper = $('#info-wrapper');
            var locateInfoLayer = locateInfoWrapper.find('#info-layer');
            locateInfoLayer.html(model[0].attributes.info);
            var locateInfoClose = locateInfoWrapper.find('#info-layer-close');
            locateInfoClose.show();
            locateInfoWrapper.show();
        },
        
        smartphoneFirstLevel: function(){                 
            var winWidth;	
			var winHeight;
			
			setTimeout("setSmartphone()", 10);
		
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems = '';
                        
            // render the view            
            CollectionMenu.each( function(model){                       

                    if(model.attributes.category === 'smartphone') {                          
                                                
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value , serverUri: model.attributes.server_uri, iconPath: model.attributes.icon_path} );
                              
                        });
                                    
                    }
                  
            });   
			//fit texts
          
          
            // render
            $(this.el).html( _.template( templateSmartphone, {} ));  
            $(this.div).append( this.templateFirstLevelListItems );   
             $(".linkSmartphone").fitText(1.0);
                           
        }, 
        
        
        smartphoneSecondLevel: function(id){
           
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
                  
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionSmartphone();   
                
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
        
        smartphoneThirdLevel: function(id, id2){
            
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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {project: project, media: Util.splitMedia(value, serverUri, pathSmallPics, pathBigPics)} );
                  
            });             
            
			
			// render site
			$(this.el).html(Slider.slider2Init());    
            $(this.sliderProject).append(this.templateThirdLevelListItems);	 
            Slider.setInfo(pathBigPics, serverUri);
            //this.initPageSize();

			//this.setDrawings();  
            	 
            $(this.el).append(Slider.slider2Set());	 
        }  
                
        
        
    });
    
    return new View();
        
});
