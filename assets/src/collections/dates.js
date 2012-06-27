define([
    'jquery', 'underscore', 'backbone', 'models/dates'
], function($, _, Backbone, datesModel) {

    var collection = Backbone.Collection.extend({
        model: datesModel,
        url: 'src/data/dates.json'
        //url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=dates'
    });
      
    return collection;
});
