define([
    'jquery', 'underscore', 'backbone', 'models/info'
], function($, _, Backbone, infoModel) {

    var collection = Backbone.Collection.extend({
        model: infoModel,
        url: 'src/data/info.json'
    });
    
    collection = new collection();
    
    collection.fetch({
        success: function(collection) {
             console.log('info is ready to use');                                
        },
        error: function(){
            console.log('info json not found');
        }
    });
    
    return collection;
});
