define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({
            
            defaults: {
                site: null,
                description: null                
            }                        
    });
    
    return model;
});
