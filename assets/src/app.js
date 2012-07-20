// 
// initialize router & change default settings
///////////////////////////////////////////////////////
define([
    'order!jquery', 'order!jqueryMobile', 'order!jqueryFittext', 'order!underscore', 'order!backbone', 'order!router', 'order!util', 'order!iscroll'

], function($, $$, $$$, _, Backbone, Router, Util, iscroll) {

    var initialize = function() {      
        
        // check if online/offline   
        // bind eventlistener 
        /*
        $(window).bind({
            'online': showInfoLayer,
            'offline': showInfoLayer
        }); 
        */
         
        // set jqueryMobile default-settings false
        // otherwise backbone doesn´t work 
        $$.ajaxEnabled = false;
        $$.linkBindingEnabled = false;
        $$.hashListeningEnabled = false;
        $$.pushStateEnabled = false;
         
        // new router instance
        this.Router = new Router();  
                  
    };

    // if no internet accessable
    // show info layer
    var showInfoLayer = function(){
        var locateInfoWrapper = $('#info-wrapper');
        var locateInfoLayer = locateInfoWrapper.find('#info-layer');
      
        if(!locateInfoWrapper.is(':visible')){
            locateInfoWrapper.show();
            locateInfoLayer.html('<span class="no_internet_connection">Sorry... ohne Internetverbindung funktioniert´s leider nicht!</span>');    
        } else{
            locateInfoWrapper.hide();
        }
        
    };

    return {
        initialize: initialize
    };
   
   
   
});
