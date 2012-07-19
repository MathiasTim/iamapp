define([
    'jquery', 'underscore', 'backbone', 'models/drawings'
], function($, _, Backbone, drawingsModel) {

    var collection = Backbone.Collection.extend({
        model: drawingsModel,
        //url: 'src/data/drawings.json'
        url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=zeichenblock'
    });
      
    return collection;
});
