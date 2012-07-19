define([
    'jquery', 'underscore', 'backbone', 'models/camera'
], function($, _, Backbone, cameraModel) {

    var collection = Backbone.Collection.extend({
        model: cameraModel,
        //url: 'src/data/camera.json'
        url: 'http://iamapp.multimedia.hs-augsburg.de/json/requests/index.php?q=camera'
    });
      
    return collection;
});
