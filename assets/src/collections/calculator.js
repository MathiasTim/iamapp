define([
    'jquery', 'underscore', 'backbone', 'models/calculator'
], function($, _, Backbone, calculatorModel) {

    var collection = Backbone.Collection.extend({
        model: calculatorModel,
        //url: 'src/data/calculator.json'
        url: 'http://iamdesk.de/json/requests/index.php?q=smartphone'
    });
      
    return collection;
});
