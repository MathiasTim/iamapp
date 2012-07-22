define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({            
                
        defaults: {
            category: "undefined",
            info: "undefined"
        }
    });
    
    return model;
});
