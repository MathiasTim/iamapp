define([
    'jquery', 'underscore', 'backbone', 'models/home'
], function($, _, Backbone, homeModel) {

    var collection = Backbone.Collection.extend({
        model: homeModel, 
        url : 'src/data/test.json'
        //url: 'http://iamapp.multimedia.hs-augsburg.de/iamapp/default-structure/requests/index.php?q=home'
    });
      
    return collection;
});