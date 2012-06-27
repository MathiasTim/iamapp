// 
// initialize router & change default settings
///////////////////////////////////////////////////////
define([
    'jquery', 'jqueryMobile', 'jqueryFittext', 'underscore', 'backbone', 'router', 'util', 'iscroll'

], function($, $$, $$$, _, Backbone, Router, Util, iscroll) {

    var initialize = function() {      
         
        // set jqueryMobile default-settings false
        // otherwise backbone doesn´t work 
        $$.ajaxEnabled = false;
        $$.linkBindingEnabled = false;
        $$.hashListeningEnabled = false;
        $$.pushStateEnabled = false;
         
        // new router instance
        this.Router = new Router();  
                  
    };

    return {
        initialize: initialize
    };
   
   
   
});
