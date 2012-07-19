define([
    'jquery', 'underscore', 'backbone', 'models/contacts'
], function($, _, Backbone, contactsModel) {

    var collection = Backbone.Collection.extend({
        model: contactsModel,
        //url: 'src/data/contacts.json'
        url: 'http://iamdesk.de/json/requests/index.php?q=contacts'
    });
      
    return collection;
});
