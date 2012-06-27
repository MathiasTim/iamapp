define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'util', 'slider', 'collections/menu', 'views/home', 'views/laptop', 'views/camera', 'views/dates', 'views/smartphone', 'views/tablet', 'views/map', 'views/calculator', 'views/dvd', 'views/contacts'
], function($, $$, _, Backbone, Util, Slider, CollectionMenu, homeView, laptopView, cameraView, datesView, smartphoneView, tabletView, mapView, calculatorView, dvdView, contactsView) {
   
    
    var Router = Backbone.Router.extend({
        
        player : null,
        locateAudioWrapper: $('#audio'),
        myScroll : null,
        windowHeight : $(window).height(),
        windowWidth : $(window).width(),
        renderedFirst : false,        
        
        initialize: function(){            

           Backbone.history.start();
        
        },
        
        // routing points
        routes: {
            '': 'home',
            'home': 'home',             // uri --> #home
            
            // laptop
            'laptop': 'laptopFirstLevel',
            'laptop/:id': 'smartphoneSecondLevel', 
            'laptop/:id/:id2': 'smartphoneThirdLevel',            
            
            // camera
            'camera': 'cameraFirstLevel', 
            'camera/:id': 'cameraSecondLevel', 
            'camera/:id/:id2': 'cameraThirdLevel',            
            
            // tickets
            'dates': 'datesFirstLevel',
            'dates/:id': 'datesSecondLevel',
            
            // smartphone
            'smartphone': 'smartphoneFirstLevel', 
            'smartphone/:id': 'smartphoneSecondLevel', 
            'smartphone/:id/:id2': 'smartphoneThirdLevel',
            
            // tablet
            'tablet': 'tabletFirstLevel', 
            'tablet/:id': 'tabletSecondLevel', 
            'tablet/:id/:id2': 'tabletThirdLevel',
            
            // map
            'map': 'mapFirstLevel', 
            'map/:house': 'mapSecondLevel',
            'map/:house/:floor': 'mapThirdLevel',
            
            // calculator
            'calculator': 'calculatorFirstLevel',    
            'calculator/:id': 'calculatorSecondLevel', 
            'calculator/:id/:id2': 'calculatorThirdLevel',
                                   
            // dvd
            'dvd': 'dvdFirstLevel', 
            'dvd/:id': 'dvdSecondLevel', 
            'dvd/:id/:id2': 'dvdThirdLevel', 
            
            // contacts
            'contacts': 'contactsFirstLevel',
            'contacts/:id': 'contactsSecondLevel',
            
            // if router doesn´t exist
            '*actions': 'defaultAction' 
        },
        
        // all settable helperclasses
        bodyClasses: ['home', 'laptop_first_level', 'laptop_second_level', 'laptop_third_level', 'camera_first_level', 'camera_second_level', 'camera_third_level', 'calculator_first_level', 'calculator_second_level', 'calculator_third_level', 'smartphone_first_level', 'smartphone_second_level', 'smartphone_third_level', 'tablet_first_level', 'tablet_second_level', 'tablet_third_level', 'map_first_level', 'map_second_level', 'dates_first_level', 'dates_second_level', 'dvd_first_level', 'dvd_second_level', 'dvd_third_level', 'contacts_first_level', 'contacts_second_level'],
        
        
        // routing functions
        ///////////////////////////////////////////
        home: function(){    

            // $$.changePage(this.homeView.render(),{ transition: "slide"});   // not ready yet
            Util.bodyClass('home', this.bodyClasses); // need to set (and unset any other) body class for default css
            
            // just needed for iScroll
            // do it once
            if(!this.renderedFirst){
                $('body.home #scroller').css('height', this.windowHeight + 'px');               
                var locateMainWrapper = $('body.home #main');
                locateMainWrapper.css('width', this.windowWidth + 'px');
                locateMainWrapper.css('height', this.windowHeight + 'px');
                this.renderedFirst = true;
            }
            
            homeView.render();
            
            this.myScroll = new iScroll('scroller', { zoom:true, zoomMax: 2, hScrollbar: false, vScrollbar: false, bounce:false });
        },
        
        
        // laptop
        ///////////////////////////////////////////        
        laptopFirstLevel: function(){

            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/laptop_klick.mp3" type="audio/mp3" /></audio>');
                        
            Util.bodyClass('laptop_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            laptopView.laptopFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        laptopSecondLevel: function(id){
            Util.bodyClass('laptop_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            laptopView.laptopSecondLevel(id);            
        },

        laptopThirdLevel: function(id, id2){
            Util.bodyClass('laptop_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            laptopView.laptopThirdLevel(id, id2);            
        },       
        
        
        // camera
        ///////////////////////////////////////////        
        cameraFirstLevel: function(){
            
            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/kamera_klick.mp3" type="audio/mp3" /></audio>');

            Util.bodyClass('camera_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            cameraView.cameraFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        
        },
        
        cameraSecondLevel: function(id){
            Util.bodyClass('camera_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            cameraView.cameraSecondLevel(id);            
        },

        cameraThirdLevel: function(id, id2){
            Util.bodyClass('camera_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            cameraView.cameraThirdLevel(id, id2);            
        },
        
        
        // smartphone
        ///////////////////////////////////////////
        smartphoneFirstLevel: function(){
            
            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/smartphone_klick.mp3" type="audio/mp3" /></audio>');
            
            Util.bodyClass('smartphone_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            smartphoneView.smartphoneFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        smartphoneSecondLevel: function(id){
            Util.bodyClass('smartphone_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            smartphoneView.smartphoneSecondLevel(id);            
        },

        smartphoneThirdLevel: function(id, id2){
            Util.bodyClass('smartphone_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            smartphoneView.smartphoneThirdLevel(id, id2);            
        },
        
        
        // tablet
        ///////////////////////////////////////////
        tabletFirstLevel: function(){
            Util.bodyClass('tablet_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            tabletView.tabletFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        tabletSecondLevel: function(id){
            Util.bodyClass('tablet_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            tabletView.tabletSecondLevel(id);            
        },

        tabletThirdLevel: function(id, id2){
            Util.bodyClass('tablet_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            tabletView.tabletThirdLevel(id, id2);            
        },
        
        
        // map
        ///////////////////////////////////////////        
        mapFirstLevel: function(){
            
            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/flyer_klick.mp3" type="audio/mp3" /></audio>');
            
            Util.bodyClass('map_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            var kind = 'overview';
            mapView.mapFirstLevel(kind); 
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        mapSecondLevel: function(house){
            Util.bodyClass('map_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            mapView.mapSecondLevel(house); 
        },
        
        mapThirdLevel: function(house, floor){
            Util.bodyClass('map_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            mapView.mapThirdLevel(house, floor); 
        },
        
        
        // dates
        ///////////////////////////////////////////        
        datesFirstLevel: function(){
            Util.bodyClass('dates_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            datesView.datesFirstLevel();
            
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        datesSecondLevel: function(id){
            Util.bodyClass('dates_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            datesView.datesSecondLevel(id); 
        },
        
        
        // calculator
        ///////////////////////////////////////////
        calculatorFirstLevel: function(){
            
            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/block_klick.mp3" type="audio/mp3" /></audio>');

            Util.bodyClass('calculator_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            calculatorView.calculatorFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        calculatorSecondLevel: function(id){
            Util.bodyClass('calculator_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            calculatorView.calculatorSecondLevel(id);            
        },

        calculatorThirdLevel: function(id, id2){
            Util.bodyClass('calculator_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            calculatorView.calculatorThirdLevel(id, id2);            
        },
        
        
        // dvd
        ///////////////////////////////////////////
        dvdFirstLevel: function(){
            
            // play sound
            this.locateAudioWrapper.html('<audio autoplay="autoplay"><source src="src/sounds/block_klick.mp3" type="audio/mp3" /></audio>');

            Util.bodyClass('dvd_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            dvdView.dvdFirstLevel();
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        dvdSecondLevel: function(id){
            Util.bodyClass('dvd_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            dvdView.dvdSecondLevel(id);            
        },

        dvdThirdLevel: function(id, id2){
            Util.bodyClass('dvd_third_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            dvdView.dvdThirdLevel(id, id2);            
        },
        
        // contacts
        ///////////////////////////////////////////        
        contactsFirstLevel: function(){
            Util.bodyClass('contacts_first_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            contactsView.contactsFirstLevel(); 
            // remove zooming for first Level
            if(this.myScroll != null){ 
                this.myScroll.destroy();
                this.myScroll = null;
            }
        },
        
        contactsSecondLevel: function(id){
            Util.bodyClass('contacts_second_level', this.bodyClasses); // need to set (and unset any other) body class for default css
            contactsView.contactsSecondLevel(id); 
        },
        
        
        // routing functions
        ///////////////////////////////////////////
        defaultAction: function(actions) {
            this.navigate("home", true);
        }
        
        
    });
    
    return Router;
    
});
