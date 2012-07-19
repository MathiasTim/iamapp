define([
    'jquery', 'underscore', 'backbone', 'models/smartphone'
], function($, _, Backbone, smartphoneModel) {

    var collection = Backbone.Collection.extend({
        model: smartphoneModel,
        //url: 'src/data/smartphone.json'
        url: 'http://iamdesk.de/json/requests/index.php?q=smartphone'
    });
      
    return collection;
});
