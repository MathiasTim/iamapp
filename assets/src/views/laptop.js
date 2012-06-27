define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'collections/menu', 'collections/laptop', 'text!templates/laptop/laptop.html', 'text!templates/laptop/firstLevelListItems1.html', 'text!templates/laptop/firstLevelListItems2.html','text!templates/laptop/secondLevelListItems.html', 'text!templates/laptop/thirdLevel.html', 'text!templates/laptop/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, CollectionMenu, CollectionLaptop, templateLaptop, templateFirstLevelListItems1, templateFirstLevelListItems2, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
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
                            that.templateFirstLevelListItems1 += _.template(templateFirstLevelListItems1, { value: value } );
                            that.templateFirstLevelListItems2 += _.template(templateFirstLevelListItems2, { value: value } );
                              
                        });                                      
                    }    
            });  

            // render            
            
            $(this.el).html( _.template( templateLaptop, {} ));            
            $(this.divFolder).html( this.templateFirstLevelListItems1 );
            $(this.divMenu).html( this.templateFirstLevelListItems2 );
             
			// scale + align laptop container
			var $lpt_center_container = $(this.el).find('#lpt_center_container');			
			if ( deviceHeight > 0.75*deviceWidth ){
				$lpt_center_container.css({ 
					'top': offsetTop+ 'px'
				});
			}		
            $lpt_center_container.css({
                    'width': width+'px',
                    'height': height+'px'
            });
                
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
                alert('laptop exists');
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
                  that.templateThirdLevelListItems += _.template(templateThirdLevelListItems, {media: Util.splitMedia(value)} );
                  
            });             
            
            // render site
            $(this.el).html(this.templateThirdLevel);
            $(this.el).append('<b>Media:</b>' +this.templateThirdLevelListItems);

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
		  
		  
		  
		  /* ############## CLICK EVENTS ############## */

		 infoClicked 			: function(event){  console.log("info clicked"); },
		 backwardClicked 		: function(event){  console.log("zurueck clicked"); }
		 

        
    });
    
    return new View();
        
});
