define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({            
                
        defaults: {
            id: 0,
            house: "house",
            server_uri: "server_uri",
            pics: "pics",
            floors: [
                           {
                               title: "title",
                               img_uri: "img_uri",
                               next: "next",
                               prev: "prev",
                               house: "house"
                           }
                       ]
        }
        
    });
    
    return model;
});
