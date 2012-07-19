define([
    'jquery', 'underscore', 'backbone', 'models/dates'
], function($, _, Backbone, datesModel) {

    var collection = Backbone.Collection.extend({
        model: datesModel,
        //url: 'src/data/dates.json'
        url: 'http://iamdesk.de/json/requests/index.php?q=dates'
    });
      
    return collection;
});
