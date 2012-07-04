define([
    'jquery', 'underscore', 'backbone', 'models/dvd'
], function($, _, Backbone, dvdModel) {

    var collection = Backbone.Collection.extend({
        model: dvdModel,
        url: 'src/data/dvd.json'
        //url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=dvd'
    });
      
    return collection;
});
