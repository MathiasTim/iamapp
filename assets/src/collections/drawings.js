define([
    'jquery', 'underscore', 'backbone', 'models/drawings'
], function($, _, Backbone, drawingsModel) {

    var collection = Backbone.Collection.extend({
        model: drawingsModel,
        //url: 'src/data/drawings.json'
        url: 'http://iamdesk.de/json/requests/index.php?q=dvd'
    });
      
    return collection;
});
