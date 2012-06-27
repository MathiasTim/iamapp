define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'collections/menu', 'collections/calculator', 'text!templates/calculator/calculator.html', 'text!templates/calculator/firstLevelListItems.html', 'text!templates/calculator/secondLevelListItems.html', 'text!templates/calculator/thirdLevel.html', 'text!templates/calculator/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, CollectionMenu, CollectionCalculator, templateCalculator, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el : '#main',
        ul : '.calc_element_template',
        
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
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value } );
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
        
        calculatorThirdLevel: function(id, id2){
            
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
        
		  
		  /* ############## CLICK EVENTS ############## */
		 infoClicked 			: function(event){  console.log("info clicked"); },
		 backwardClicked 		: function(event){  console.log("zurueck clicked"); }        
        
   
        
    });
    
    return new View();
        
});
