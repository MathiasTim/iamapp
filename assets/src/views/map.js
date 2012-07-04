define([
    'jquery', 'underscore', 'backbone', 'util', 'collections/map', 'text!templates/map/map.html', 'text!templates/map/secondLevel.html'
], function($, _, Backbone, Util, CollectionMap, template, templateSecondLevel) {
        
    var View = Backbone.View.extend({
        
        el: '#main', // target
        template: '',
        templateSecondLevel: '',
        dataAlreadyExist: false,
        tabletWidth: '2048', // px-Auflösung des Tablet Bildes
        tabletHeight: '1185', // px-Auflösung des Tablet Bildes
        
        initialize: function(){
            
        },
        
        getMap: function(kind){
            this.mapImage = new Image();
        	this.mapImage.src = "src/img/map/"+kind+".png";
        },
        
        mapFirstLevel: function(kind){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            this.template = _.template(template, {} );
            
            this.getMap(kind);
            
            $(this.el).html(this.template).trigger('create').find('#inner-content').append(this.mapImage);
        },
        
        mapSecondLevel: function(house){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // fyi:
            // by convention, we make a private 'that' variable. 
            // 'this' is used to make the object available to the private methods
            var that = this;            

            if(!this.dataAlreadyExist){
                
                this.collection = new CollectionMap();   
                
                // just fetch the data from the server once         
                this.collection.fetch({
                    success: function(collection) {
                        that.renderSecondLevel(house);
                        that.dataAlreadyExist = true;  
                    },
                    
                    error: function(){
                        console.log('something went wrong --> fetching data failed');
                    }
                }); 
                
            } else {
                this.renderSecondLevel(house);
            }
        },
        
        renderSecondLevel: function(house){
            var that = this;
            this.templateSecondLevel = '';
            
            this.getDimensions();
            
            // loop 
            this.collection.each( function(model){                       
                if(model.get('house') === house){                            
                    var first_floor = model.attributes.floors[0];
                    // pathes
                    if(Util.resolutionType === 'high'){
                        var subdir = 'high';
                    } else{
                        var subdir = 'low';
                    }
                    var pathPics = model.attributes.pics+subdir;
                    that.templateSecondLevel = _.template(templateSecondLevel, { floor: first_floor, pathPics: pathPics } );
                }
            });
            
            // render
            $(this.el).html(this.templateSecondLevel);
            
            // set content size
            var $map_content = $(this.el).find('#map_content');
            $map_content.css({
                    'width': this.width+'px',
                    'height': this.height+'px'
            });
        },
        
        
        mapThirdLevel: function(house, floor_title){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            this.getDimensions();
            
            // clear templates
            this.templateSecondLevel = '';
            
            // find the entry
            var house = this.collection.where({house: house});
            
            // pathes
            // pathes
            if(Util.resolutionType === 'high'){
                var subdir = 'high';
            } else{
                var subdir = 'low';
            }
            var pathPics = house[0].attributes.pics+subdir;
            
            // find the floor
            var that = this;
            _.each(house[0].attributes.floors, function(floor){ 
                if(floor.title === floor_title){
                    that.templateSecondLevel = _.template(templateSecondLevel, { floor: floor, pathPics: pathPics } );
               }
            }); 
            
            // render site
            $(this.el).html(this.templateSecondLevel);
            
            // set content size
            var $map_content = $(this.el).find('#map_content');
            $map_content.css({
                    'width': this.width+'px',
                    'height': this.height+'px'
            });
        },
        
        
        getDimensions: function() {
            // calculate width & height for the tablet image
            var deviceWidth = window.innerWidth;
            var deviceHeight = window.innerHeight;
            
            var dW = deviceWidth/this.tabletWidth;
            var dH = deviceHeight/this.tabletHeight;
            var min = Math.min(dW, dH);
            
            this.width = this.tabletWidth*min - 40; // padding!
            this.height = this.tabletHeight*min - 40;
            
            
        }
        
    });
    
    return new View();
        
});
