// 
// utils: overall functions
///////////////////////////////////////////////////////
define([
    'jquery', 'jqueryMobile'
], function($, $$) {

    // image resolution
    // - high = ipad images
    // - low = iphone images 
    var resolutionType = 'low'; // default = low, set in view/home.js

    // need to set (and unset any other) body class for default css
    var bodyClass = function(newClass, classes) {  
        var $body = $('body');
        for (var cl = 0; cl < classes.length; cl++) {
            $body.removeClass(classes[cl]);
        }
        $body.addClass(newClass);
    
    };
    
    // loading screen
    var loadingScreen = function(){
        return '<div id="loading-data"></div>';
    };
    
    // split media data
    var splitMedia = function(value, serverUri, pathSmallPic, pathBigPic){

          var id,
              content; 

          if(value.match("image://")){
              id = value.split("image://")[1];
              
              var imagePath = null;
              
              if(resolutionType === 'low'){
                  imagePath = serverUri+pathSmallPic+id;
              } else {
                  imagePath = serverUri+pathBigPic+id;
              }
              content = '<img src="' + imagePath + '" alt="' + id + '" />';

              return content;
              
          } else if(value.match("vimeo://v/")) {
              id = value.split("vimeo://v/")[1];
              
              if (window.innerHeight < 440) {
              	content = '<iframe class="vimeo-player" src="http://player.vimeo.com/video/' + id + '" width="80%" height="200px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
              } else {
              	content = '<iframe class="vimeo-player" src="http://player.vimeo.com/video/' + id + '" width="80%" height="350px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
              }
              return content;
              
          } else {
              id = value.split("youtube://v/")[1];
              if (window.innerHeight < 440) {
              	content = '<iframe class="youtube-player" type="text/html" width="80%" height="200px" src="http://www.youtube.com/embed/' + id +'" frameborder="0"></iframe>';
              } else {
              	content = '<iframe class="youtube-player" type="text/html" width="80%" height="350px" src="http://www.youtube.com/embed/' + id +'" frameborder="0"></iframe>';
              }
              return content;
              
          }
          
    };


    return {
            bodyClass: bodyClass,
            loadingScreen: loadingScreen,
            splitMedia: splitMedia
    };
   
   
   
});
