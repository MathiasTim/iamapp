define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'text!templates/home/desk.html'
], function($, $$, _, Backbone, Util, templateDesk) {
        
    var View = Backbone.View.extend({
       
        el                   : '#main', 
        locateMainElement    : $('#main'),
        deskTemplate         : '',
        windowWidth: '',
        windowHeight: '',
        locateAudioWrapper: '',
        
        events: {
            "click .apfel"     : "changeImage",
            "click .kaffee"     : "changeImage"
        }, 
        
        initialize: function(){
                    
                    // check resolution once
                    // - resolution >= 1000 use ipad images
                    // - resolution < 1000 use iphone images
                    this.windowWidth = $(window).width();
                    this.windowHeight = $(window).height();
                    var resolution = 'low';
                    
                    if( navigator.userAgent.match(/Android/i)) {
                        this.windowWidth = screen.width;
                        this.windowHeight = screen.height;
                    } else if (
                     navigator.userAgent.match(/iPhone/i)
                     || navigator.userAgent.match(/iPad/i)
                     || navigator.userAgent.match(/iPod/i)
                     ){
                        this.windowWidth = screen.height;
                        this.windowHeight = screen.width;
                     }
                     
                    if(this.windowWidth >= 1000){
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
                    
                    
                    //console.log('used resolution: ' + resolution + ' (view/home.js)');
                    
                    this.deskTemplate += _.template(templateDesk, {resolution: resolution} );
                    
        },
                
        render: function(audioWrapper){
            
            // audioWrapper given from the router,
            // spare bubbling DOM again and again
            this.locateAudioWrapper = audioWrapper;
            
            // set windowHeight for iScroll once
            this.locateMainElement.css('width', this.windowWidth+'px');
            this.locateMainElement.css('height', this.windowHeight+'px');
            $('#scroller').css('height', this.windowHeight+'px');
            
            $(this.el).html( this.deskTemplate );
        },
        
        changeImage: function(event){
            var locateClickedElement = $(event.target);
            var whichElement = locateClickedElement.attr('class');

            if(Util.resolutionType === 'high'){
                if(whichElement === 'kaffee'){
                    locateClickedElement.attr('src', 'src/img/desk/high/kaffee_leer.png');
                    // play sound
                    this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/kaffee.mp3" type="audio/mp3" /></audio>');
                } else {
                    locateClickedElement.attr('src', 'src/img/desk/high/apfel_angebissen.png');
                    // play sound
                    this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/apple.mp3" type="audio/mp3" /></audio>');
                }
            } else{
                if(whichElement === 'kaffee'){
                    locateClickedElement.attr('src', 'src/img/desk/low/kaffee_leer.png');
                    // play sound
                    this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/kaffee.mp3" type="audio/mp3" /></audio>');
                } else {
                    locateClickedElement.attr('src', 'src/img/desk/low/apfel_angebissen.png');
                    // play sound
                    this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/apple.mp3" type="audio/mp3" /></audio>');
                }
            }
            
        }        
        
    });
    
    return new View();
        
});
