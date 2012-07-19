define([
    'jquery', 'underscore', 'backbone', 'models/camera'
], function($, _, Backbone, cameraModel) {

    var collection = Backbone.Collection.extend({
        model: cameraModel,
        url: 'src/data/camera.json'
        //url: 'http://iamdesk.de/json/requests/index.php?q=smartphone'
    });
      
    return collection;
});
