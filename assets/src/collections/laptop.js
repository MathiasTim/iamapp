define([
    'jquery', 'underscore', 'backbone', 'models/laptop'
], function($, _, Backbone, laptopModel) {

    var collection = Backbone.Collection.extend({
        model: laptopModel,
        url: 'src/data/laptop.json'
        //url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=smartphone'
    });
      
    return collection;
});