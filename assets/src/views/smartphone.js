function setSmartphone() {
				vinWidth = $("body").width();
				vinHeight = $("body").height();
				pageWidth = vinHeight * 1.3 + "px";
				
				$("img.full").css("height", vinHeight * 0.944);
				$("#smartphone_page").css("width", pageWidth);
				var rowCount = $('#smartphone_links div').length;
				
				//var percent = 100 - rowCount ;
				//percent = percent - (rowCount * 2) - 5;
				
				//var rowWidth = (percent / rowCount + "%");
				// $("#smartphone_links div").css("width", rowWidth);
}	

define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'collections/menu', 'collections/smartphone', 'text!templates/smartphone/smartphone.html', 'text!templates/smartphone/firstLevelListItems.html', 'text!templates/smartphone/secondLevelListItems.html', 'text!templates/smartphone/thirdLevel.html', 'text!templates/smartphone/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, CollectionMenu, CollectionSmartphone, templateSmartphone, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        div : '#smartphone_links',
        
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

          
            // render
            $(this.el).html( _.template( templateSmartphone, {} ));  
            $(this.div).append( this.templateFirstLevelListItems );                  
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
                 
                 // loop 
                 this.collection.each( function(model){                       
           
                    if(model.get('id') === id){                            
                        
                        var subId = 0;
                        
                        _.each(model.attributes.projects, function(value){ 
                                                                                         
                              that.templateSecondLevelListItems += _.template(templateSecondLevelListItems, { value: value, id:id, subId:subId++ } );                     
                          
                        });  
              
                    }
    
                  
                 });                      
                                   
                 
                 // render                     
                 $(this.el).html(that.templateSecondLevelListItems);
            
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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {media: Util.splitMedia(value)} );
                  
            });             
            
            // render site
            $(this.el).html(this.templateThirdLevel);
            $(this.el).append('<b>Media:</b>' +this.templateThirdLevelListItems);

        }  
                
        
        
    });
    
    return new View();
        
});
