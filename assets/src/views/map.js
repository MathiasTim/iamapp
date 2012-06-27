define([
    'jquery', 'underscore', 'backbone', 'util', 'collections/map', 'text!templates/map/map.html', 'text!templates/map/secondLevel.html'
], function($, _, Backbone, Util, CollectionMap, template, templateSecondLevel) {
        
    var View = Backbone.View.extend({
        
        el: '#main', // target
        mapImage: new Image(),
        imgWidth: 0,
        imgHeight: 0,
        
        template: '',
        templateSecondLevel: '',
        dataAlreadyExist: false,
        
        initialize: function(){
            
        },
        
        getMap: function(kind){
        	this.mapImage.src = "src/img/map/"+kind+".png";
        },
        
        setImageSize: function(){
            var img = $(this.el).find('img');
            
            var iW = window.innerWidth - img.offset().left;
        	var iH = window.innerHeight - img.offset().top;
        	var w = this.imgWidth;
        	var h = this.imgHeight;
        	
        	var dW = iW / w;
        	var dH = iH / h;
        	
        	var min = Math.min(dW, dH);
        	
            var width = w*min - 40;
            var height = h*min - 40;
            
        	img.width(width);
            img.height(height);
            img.css('visibility', 'visible');
        },
        
        checkComplete: function(){
            var that = this;
            
            if(this.mapImage.complete) {
                this.setImageSize();
            } else {
                setTimeout(function(){
                    that.checkComplete();
                }, 1000);
            }
        },
        
        mapFirstLevel: function(kind){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            this.template = _.template(template, {} );
            
            this.getMap(kind);
            
            $(this.el).html(this.template).trigger('create').find('#inner-content').append(this.mapImage);
            $(this.el).find('img').css('visibility', 'hidden').width('auto').height('auto');
            this.mapImage.onload = getImageSize;
            
            var that = this;
            function getImageSize(){
                that.imgWidth = this.width;
                that.imgHeight = this.height;
                that.checkComplete();
            }
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
            
            // loop 
            this.collection.each( function(model){                       
                if(model.get('house') === house){                            
                    var first_floor = model.attributes.floors[0];
                    // pathes
                    var pathBigPics = model.attributes.big_pics;
                    var serverUri = model.attributes.server_uri;
                    that.templateSecondLevel = _.template(templateSecondLevel, { floor: first_floor, pathBigPics: pathBigPics } );
                }
            });
            
            // render
            $(this.el).html(this.templateSecondLevel);
        },
        
        
        mapThirdLevel: function(house, floor_title){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // clear templates
            this.templateSecondLevel = '';
            
            // find the entry
            var house = this.collection.where({house: house});
            
            // pathes
            var pathBigPics = house[0].attributes.big_pics;
            var serverUri = house[0].attributes.server_uri;
            
            // find the floor
            var that = this;
            _.each(house[0].attributes.floors, function(floor){ 
                if(floor.title === floor_title){
                    that.templateSecondLevel = _.template(templateSecondLevel, { floor: floor, pathBigPics: pathBigPics } );
               }
            }); 
            
            // render site
            $(this.el).html(this.templateSecondLevel);
        },
        
    });
    
    return new View();
        
});
