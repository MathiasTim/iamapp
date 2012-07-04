define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'collections/drawings', 'text!templates/drawings/drawings.html', 'text!templates/drawings/firstLevelListItems.html', 'text!templates/drawings/secondLevelListItems.html', 'text!templates/drawings/thirdLevel.html', 'text!templates/drawings/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, CollectionDrawings, templateDrawings, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        div : '#drawings_links',
        sliderContainer1 : '#sliderProject .slide1',
        sliderContainer2 : '#sliderProject .slide2',
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
        
        setDrawings: function() {
			var winWidth;	
			var winHeight;
			
			vinWidth = $("body").width();
			vinHeight = $("body").height();
			pageWidth = vinHeight * 1.3 + "px";
			
			$("#zb_page").css("width", pageWidth)
			
			$("#zb_mediaPlayer").html("<img src='src/img/drawings/Interaktive-Zeichnung.gif'>");
			
			var linkCount = $("#drawings_links a").length;
			var linkWidth = $("#drawings_links").width();
			
			linkWidth = linkWidth - (linkCount * 2)
			
			linkWidth = linkWidth / linkCount - (linkWidth * 0.03);
			
			$("#drawings_links img").css("width", linkWidth)
		},	
        
        drawingsFirstLevel: function(){                 
			
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
                        
            this.templateFirstLevelListItems = '';
                        
            // render the view            
            CollectionMenu.each( function(model){                       

                    if(model.attributes.category === 'drawings') {                          
                                                
                        _.each(model.attributes.menu, function(value){
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value , serverUri: model.attributes.server_uri, iconPath: model.attributes.icon_path} );
                              
                        });
                                    
                    }
                  
            });   

          	//this.initPageSize();
            // render
            $(this.el).html( _.template( templateDrawings, {} ));  
            
            $(this.div).html( this.templateFirstLevelListItems );

			this.setDrawings();                              
        }, 
        
        
        drawingsSecondLevel: function(id){
           
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionDrawings();   
                
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
                 
                 // loop 
                 this.collection.each( function(model){                       
           
                    if(model.get('id') === id){                            
                        
                        var subId = 0;
                        
                        _.each(model.attributes.projects, function(value){ 
                                                                                         
                              that.templateSecondLevelListItems += _.template(templateSecondLevelListItems, { value: value, id:id, subId:subId++ } );                     
                          
                        });  
              
                    }
    
                  
                 });                      
                 
                 
                                   
                 // render MediaSlider
            	 $(this.el).append(Slider.sliderInit());    
            	 $(this.el).html(Slider.sliderPageSize());
            	 //this.initPageSize();

				 this.setDrawings();  
            	 
            	 $(this.el).append(Slider.sliderSet());
                 
                 // render                     
                 $(this.sliderContainer1).append(that.templateSecondLevelListItems);
                 
                 $(this.sliderContainer2).append(that.templateSecondLevelListItems);
            
        },
        
        drawingsThirdLevel: function(id, id2){
            
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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {media: Util.splitMedia(value)} );
                  
            });             
            
            // render site
            
			$(this.el).html(Slider.slider2Init());    
            $(this.sliderProject).append(this.templateThirdLevelListItems);	 
            //this.initPageSize();

			this.setDrawings();  
            	 
            $(this.el).append(Slider.slider2Set());	 


        }  
                
        
        
    });
    
    return new View();
        
});
