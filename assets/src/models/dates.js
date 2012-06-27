define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({            
                
            defaults: {
                id: 0,
                icon: "icon",
                title: "title",
                description : "description",
                start: "start",
                end: "end"
            }
                        
    });
    
    return model;
});
