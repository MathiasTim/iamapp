// which libs are used
require.config({
    paths: {
        "jquery"       : "js_libs/jquery/jquery-1.7.2.min",
        "jqueryMobile" : "js_libs/jquery/jquery.mobile-1.1.0.min",
        "jqueryFittext": "js_libs/jquery/jquery.fittext",
        "underscore"   : "js_libs/underscore/underscore.min",
        "backbone"     : "js_libs/backbone/backbone.min",
        "order"        : "js_libs/require/order",
        "text"         : "js_libs/require/text",
        "iscroll"      : "js_libs/iscroll/iscroll", 
        "swipe"        : "js_libs/slider/swipe", 
        "swipeup"	   : "js_libs/slider/swipeup"
    }
});

require([

// Load our app module and pass it to our definition function
"app"
// Some plugins have to be loaded in order due to their non AMD compliance
// Because these scripts are not "modules" they do not pass any values to the
// definition function below
], function(App) {
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don"t
    // pass a parameter to this function
    App.initialize();            
});