define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'collections/home', 'text!templates/home/desk.html'
], function($, $$, _, Backbone, Util, CollectionHome, templateDesk) {
        
    var View = Backbone.View.extend({
       
        el                   : '#main', 
        locateMainElement    : $('#main'),
        deskTemplate         : '',
        
        events: {
            "click .apfel"     : "changeImage",
        }, 
        
        initialize: function(){
                    
                    // check resolution once
                    // - resolution >= 1000 use ipad images
                    // - resolution < 1000 use iphone images
                    var windowWidth = $(window).width();
                    var windowHeight = $(window).height();
                    var resolution = 'low';
                    
                    if( navigator.userAgent.match(/Android/i)) {
                        windowWidth = screen.width;
                        windowHeight = screen.height;
                    } else if (
                     navigator.userAgent.match(/iPhone/i)
                     || navigator.userAgent.match(/iPad/i)
                     || navigator.userAgent.match(/iPod/i)
                     ){
                        windowWidth = screen.height;
                        windowHeight = screen.width;
                     }
                     
                    if(windowWidth >= 1000){
                        Util.resolutionType = 'high';
                        resolution = 'high';

                        // set fullscreen background once
                        this.locateMainElement.addClass('high_resolution');

                    } else {
                        Util.resolutionType = 'low';
                        resolution = 'low';
                        
                        // set fullscreen background once
                        this.locateMainElement.addClass('low_resolution');
                    }
                    
                    // set windowHeight for iScroll once
                    this.locateMainElement.css('width', windowWidth+'px');
                    this.locateMainElement.css('height', windowHeight+'px');
                   
                    console.log('used resolution: ' + resolution + ' (view/home.js)');
                    
                    this.deskTemplate += _.template(templateDesk, {resolution: resolution} );
                    
        },
                
        render: function(){   
              $(this.el).html( this.deskTemplate );
        },
        
        changeImage: function(event){
            var locateClickedElement = $(event.target);

            if(Util.resolutionType === 'high'){
                locateClickedElement.attr('src', 'src/img/desk/high/apfel_angebissen.png');
            } else{
                locateClickedElement.attr('src', 'src/img/desk/low/apfel_angebissen.png');
            }
            
        }        
        
    });
    
    return new View();
        
});
