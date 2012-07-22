define([
    'jquery', 'underscore', 'backbone', 'models/map'
], function($, _, Backbone, mapModel) {

    var collection = Backbone.Collection.extend({
        model: mapModel,
        url: 'src/data/map.json'
    });
      
    return collection;
});
