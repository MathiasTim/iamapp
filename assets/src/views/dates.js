define([
    'jquery', 'underscore', 'backbone', 'util', 'models/dates', 'text!templates/date/dates.html', 'collections/dates', 'text!templates/date/dateListItems.html', 'text!templates/date/dateDetail.html'
], function($, _, Backbone, Util, modelDates, template, CollectionDates, dateListItem, dateDetail) {
        
    var View = Backbone.View.extend({
        
        el: '#main', // target
        dateListItem: '',
        dateDetail: '',
        dataAlreadyExist: false,
        
        initialize: function(){
            
        },
        
        datesFirstLevel: function(){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            $('#main').css('width', 'auto');
            $('#main').css('height', 'auto');
            
            
            // fyi:
        	// by convention, we make a private 'that' variable. 
        	// 'this' is used to make the object available to the private methods
        	var that = this;
        	
        	if(!this.dataAlreadyExist){
                this.collection = new CollectionDates(); 
                this.collection.fetch({
                    success: function(collection) {
                        // comparator for sorting by start date
                        collection.comparator = function(model) {
                            return model.get('start');
                        };
                        collection.sort('start'); // sorting ASC
                        //collection.models = collection.models.reverse(); // DESC
                        //collection.trigger('reset', collection, {}); // info that collection has changed (reverse)
                        
                        collection.each( function(model){
                            // converting
                            var start = model.attributes.start;
                            start =  start.replace(/ /g, ",").replace(/-/g, ",").replace(/:/g, ",");
                            var start_arr = start.split(",");
                            for(var s = 1; s < 5; s++){
                                if(start_arr[s].charAt(0) == "0")
                                    start_arr[s] = start_arr[s].charAt(1);
                            }
                            var syear = parseInt(start_arr[0]);
                            var smonth = parseInt(start_arr[1])-1;
                            var sday = parseInt(start_arr[2]);
                            var shour = parseInt(start_arr[3]);
                            var sminute = parseInt(start_arr[4]);
                            start = new Date(syear, smonth, sday, shour, sminute, 0);
                            model.attributes.start = start;
                            syear = start.getFullYear();
                            smonth = start.getMonth()+1;
                            if(smonth<10)
                                smonth = "0"+smonth;
                            sday = start.getDate();
                            if(sday<10)
                                sday = "0"+sday;
                            shour = start.getHours();
                            if(shour<10)
                                shour = "0"+shour;
                            sminute = start.getMinutes();
                            if(sminute<10)
                                sminute = "0"+sminute;
                            model.attributes.start_date = sday+"."+smonth+"."+syear;
                            model.attributes.start_time = shour+":"+sminute+" Uhr";
                            
                            
                            var end = model.attributes.end;
                            end =  end.replace(/ /g, ",").replace(/-/g, ",").replace(/:/g, ",");
                            var end_arr = end.split(",");
                            for(var e = 1; e < 5; e++){
                                if(end_arr[e].charAt(0) == "0")
                                    end_arr[e] = end_arr[e].charAt(1);
                            }
                            var eyear = parseInt(end_arr[0]);
                            var emonth = parseInt(end_arr[1])-1;
                            var eday = parseInt(end_arr[2]);
                            var ehour = parseInt(end_arr[3]);
                            var eminute = parseInt(end_arr[4]);
                            end = new Date(eyear, emonth, eday, ehour, eminute, 0);
                            model.attributes.end = end;
                            eyear = end.getFullYear();
                            emonth = end.getMonth()+1;
                            if(emonth<10)
                                emonth = "0"+emonth;
                            eday = end.getDate();
                            if(eday<10)
                                eday = "0"+eday;
                            ehour = end.getHours();
                            if(ehour<10)
                                ehour = "0"+ehour;
                            eminute = end.getMinutes();
                            if(eminute<10)
                                eminute = "0"+eminute;
                            model.attributes.end_date = eday+"."+emonth+"."+eyear;
                            model.attributes.end_time = ehour+":"+eminute+" Uhr";
                        });
                        
                        that.renderFirstLevel();
                        that.dataAlreadyExist = true; 
                    },
                    error: function(){
                        console.log('something went wrong --> fetching data failed');
                    }
                }); 
            } else {
                this.renderFirstLevel();
            }
        },
        
        datesSecondLevel: function(id){
            // render loadingScreen
            $(this.el).html(Util.loadingScreen());
            
            // read model and send data to template
            var model = this.collection.where({"id": parseInt(id)});
            
            model = model[0];
            
            this.dateDetail = _.template(dateDetail, { model: model.attributes } );
            
            // render detail view
            $(this.el).html(this.dateDetail).trigger('create');  
        },
        
        renderFirstLevel: function(){
            var that = this;
            var divider = ''; // helping variable
            this.dateListItem = ''; // clear
            // loop 
            this.collection.each( function(model){
                var start = model.attributes.start;
                
                // creating dividers
                var months = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
                var temp_divider = months[start.getMonth()] + " " + start.getFullYear();
                
                if(divider != temp_divider) {
                    divider = temp_divider;
                    that.dateListItem += '<li data-role="list-divider">' + divider + '</li>';
                }
                
                // send model data to template
                that.dateListItem += _.template(dateListItem, { model: model.attributes } );                    
            });
            
            this.template = _.template(template, {} );
            
            // render the view           
            $(this.el).html(this.template).trigger('create');           // if you generate NEW markup (e.g. ajax-load) you have to trigger the create event again
            $(this.el).find('#date-listning').append(this.dateListItem).listview('refresh');   // refresh is almost the same like 'create', the difference is that the markup already exists
            
            $(this.el).find('li.ui-li-divider').addClass('ui-corner-top').prev().addClass('ui-corner-bottom').parent().removeClass('ui-shadow');
            
            $(".headline").fitText(8.5).trigger('create');
        }
        
    });
    
    return new View();
        
});
