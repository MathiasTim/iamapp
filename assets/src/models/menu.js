define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {
    
    
    var model = Backbone.Model.extend({
            
            defaults: {
                server_uri: "",
                icon_path : "",
                category  : "",
                menu      : []                
            }
            
    });
    
    return model;
});

