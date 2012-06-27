define([
    'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {    
    
    var model = Backbone.Model.extend({            
                
            defaults: {
                id: 0,
                title: "title",
                firstname: "firstname",
                lastname : "lastname",
                funktion: "funktion",
                phone: "phone",
                email: "email"
            }
                        
    });
    
    return model;
});
