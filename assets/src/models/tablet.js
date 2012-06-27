define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({            
                
        defaults: {
            id: 0,
            subject_description: "",
            server_uri: "server_uri",
            small_pics: "small_pics",
            big_pics: "big_pics",
            projects: [
                           {
                               title: "title",
                               media: [],
                               authors: "authors",
                               uri: "uri",
                               icon_uri: "icon_uri",
                               term: "term",
                               project_description: "description"
                           }
                       ]
        }
        
    });
    
    return model;
});
