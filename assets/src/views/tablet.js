define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'collections/menu', 'collections/tablet', 'text!templates/tablet/firstLevel.html', 'text!templates/tablet/secondLevel.html', 'text!templates/tablet/firstLevelListItems.html', 'text!templates/tablet/secondLevelListItems.html', 'text!templates/tablet/thirdLevel.html', 'text!templates/tablet/thirdLevelListItems.html'
], function($, $$, _, Backbone, Util, CollectionMenu, CollectionTablet, templateFirstLevel, templateSecondLevel, templateFirstLevelListItems, templateSecondLevelListItems, templateThirdLevel, templateThirdLevelListItems) {
        
    var View = Backbone.View.extend({
       
        el: '#main',
        templateFirstLevel: '',
        templateFirstLevelListItems: '',
        templateSecondLevel: '',
        templateSecondLevelListItems: '',
        templateThirdLevel: '',
        templateThirdLevelListItems: '',
        collection: '',
        dataAlreadyExist: false,
        tabletWidth: '1770', // px-Auflösung des Tablet Bildes
        tabletHeight: '1332', // px-Auflösung des Tablet Bildes
        headerStatus: 'collapsed',

        events: {
            "click .header" : "toggleHeader",
        }, 
        
        initialize: function(){ 
              
        },
        
        tabletFirstLevel: function(){ 
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // calculate width & height for the tablet image
            var deviceWidth = window.innerWidth;
            var deviceHeight = window.innerHeight;
            
            var dW = deviceWidth/this.tabletWidth;
            var dH = deviceHeight/this.tabletHeight;
            var min = Math.min(dW, dH);
            
            var width = this.tabletWidth*min - 20; // padding!
            var height = this.tabletHeight*min - 20;
            
            if(width < 768)
                this.max_list_count = 8;
            else 
                this.max_list_count = 21;
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods                
            var that = this;
            
            this.templateFirstLevel = _.template(templateFirstLevel, {} );
            this.templateFirstLevelListItems = '';
                        
            // baue menüliste
            CollectionMenu.each( function(model){                       
                if(model.attributes.category === 'tablet') { 
                    var count = 0;
                    _.each(model.attributes.menu, function(value){
                        if (count < that.max_list_count) {
                            //value[0] = menuname, value[1] = foreign key , value[2] = thumbnail-name                            
                            that.templateFirstLevelListItems += _.template(templateFirstLevelListItems, { value: value , serverUri: model.attributes.server_uri, iconPath: model.attributes.icon_path} );
                            count++;
                        }
                    });
                }
            });
            
            // render
            $(this.el).html(this.templateFirstLevel).find('#tbl_first_level_list').append( this.templateFirstLevelListItems );
            
            // set content size
            var $tbl_content = $(this.el).find('#tbl_content');
            $tbl_content.css({
                    'width': width+'px',
                    'height': height+'px'
            });
        }, 
        
        
        tabletSecondLevel: function(id){
           
            // cast string into integer
            id = parseInt(id);
            
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
                  
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionTablet();   
                
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
            this.templateSecondLevel = _.template(templateSecondLevel, {} );
            this.templateSecondLevelListItems = ''; 
            
            var that = this;
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
            $(this.el).html(this.templateSecondLevel).find('#tbl_second_level_list').append( this.templateSecondLevelListItems );
        
        },
        
        tabletThirdLevel: function(id, id2){
            
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
        
        
        toggleHeader: function(){
            var $header = $('#tbl_content .inner-content .header');
            
            if (this.headerStatus == 'collapsed') {
                $header.find('.open').show('slideDown');
                this.headerStatus = 'open';
            } else {
                $header.find('.open').hide('slideUp');
                this.headerStatus = 'collapsed';
            }
        }
        
        
    });
    
    return new View();
        
});
