define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'collections/dvd', 'text!templates/dvd/dvd.html', 'text!templates/dvd/firstLevelListItems.html', 'text!templates/dvd/secondLevelListItems.html', 'text!templates/dvd/thirdLevel.html', 'text!templates/dvd/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionDVD, templateDVD, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        div : '#dvd_links',
        
        // Slider IDs
        sliderContainer : '#sliderProject .slide_container',
        sliderProject : '#slider ul',
        
        templateFirstLevelListItems : '',
        templateSecondLevelListItems : '',
        templateThirdLevel : '',
        templateThirdLevelListItems : '',
        collection: '',
        dataAlreadyExist: false,

        /*
        events: {
            "click .remove"     : "removeCollection",
        }, 
        */
               
        initialize: function(){           
              
        },
        
        setDVD: function() {
        	// get window/device height and width
			vinWidth = $("body").width();
			vinHeight = $("body").height();
			
			// set container width 
			pageWidth = vinHeight * 1.3 + "px";
			
			$("img.full").css("height", vinHeight * 0.944);
			
			// set row Width
			$("#dvd_page").css("width", pageWidth);
			var rowCount = $('#dvd_links a').length;
			var percent = 100 - rowCount ;
			percent = percent - (rowCount * 2) - 0;
			var rowWidth = (percent / rowCount + "%");
			$("#dvd_links a").css("width", rowWidth);
        },
        
        initPageSize: function() {
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
        },
                
        dvdFirstLevel: function(){                 
			
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems = '';
                        
            // render the view            
            CollectionMenu.each( function(model){                       

                    if(model.attributes.category === 'dvd') {                          
                           console.log(model.attributes);                     
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value , serverUri:model.attributes.server_uri , iconPath:model.attributes.icon_path} );
                              
                        });
                                    
                    }
                  
            });   
			
          	this.initPageSize();
          	
            // render
            $(this.el).html( _.template( templateDVD, {} ));  
            
            $(this.div).html( this.templateFirstLevelListItems );

			this.setDVD();                              
        }, 
        
        
        dvdSecondLevel: function(id){
           
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionDVD();   
                
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
           			
           			that.templateSecondLevelListItems += "<li>";
           			
                    if(model.get('id') === id){                            
                        
                        var subId = 0;
                        
                        _.each(model.attributes.projects, function(value){ 
                              that.templateSecondLevelListItems += _.template(templateSecondLevelListItems, { value: value, serverUri:model.attributes.server_uri, iconPath:model.attributes.big_pics, id:id, subId:subId++ } );                     
	                        
	                        i++;
	                        if (i == 6) {
	                        	that.templateSecondLevelListItems += "</li><li>";
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
        
        dvdThirdLevel: function(id, id2){
            
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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {media: Util.splitMedia(value, serverUri, pathSmallPics, pathBigPics),  project: project});
                  
            });             
            
            // render site
            
			$(this.el).html(Slider.slider2Init());    
            $(this.sliderProject).append(this.templateThirdLevelListItems);	 
           
			$(this.el).append(Slider.sliderPageSize());	 
            	 
            $(this.el).append(Slider.slider2Set());	 
			$(this.el).append(Slider.setInfo(pathBigPics, serverUri));

        }  
                
        
        
    });
    
    return new View();
        
});
