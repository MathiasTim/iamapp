define([
    'jquery', 'underscore', 'backbone', 'models/tablet'
], function($, _, Backbone, tabletModel) {

    var collection = Backbone.Collection.extend({
        model: tabletModel,
        //url: 'src/data/tablet.json'
        url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=tablet'
    });
      
    return collection;
});
