define([
    'jquery', 'underscore', 'backbone', 'models/map'
], function($, _, Backbone, mapModel) {

    var collection = Backbone.Collection.extend({
        model: mapModel,
        url: 'src/data/map.json'
        //url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=tablet'
    });
      
    return collection;
});
