define([
    'jquery', 'underscore', 'backbone', 'models/menu'
], function($, _, Backbone, menuModel) {

    var collection = Backbone.Collection.extend({
        model: menuModel,
        url: 'src/data/menu.json'
        //url: 'http://iamdesk.de/json/requests/index.php?q=menu'
    });
 
    collection = new collection();         
            
    collection.fetch({
                
        success: function(collection) {
             console.log('menu is ready to use (collections/menu.js)');                                
        },
        
        error: function(){
            console.log('no menu exist (collection)');
        }
                
    });   
      
    return collection; 
});
