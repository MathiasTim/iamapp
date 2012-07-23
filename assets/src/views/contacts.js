define([
    'jquery', 'jqueryMobile', 'underscore', 'backbone', 'models/contacts', 'text!templates/contacts/contacts.html', 'collections/contacts', 'text!templates/contacts/contactsListItems.html', 'text!templates/contacts/contactsDetail.html'
], function($,$$, _, Backbone, modelContacts, template, CollectionContacts, contactsListItem, contactsDetail) {
        
    var View = Backbone.View.extend({
        
        el: '#main', // target 
        ul: '#contacts-listning',
        contactsListItem: '',
        contactsDetail: '',
        
        toggleContainer: function() {
        $('.toggle_container').hide();
		$('.trigger').click( function() {

			var trig = $(this);
			if ( trig.hasClass('trigger_active') ) {
			
			trig.next('.toggle_container').fadeIn('slow');
			} else {
			$('.trigger_active').next('.toggle_container').fadeOut('slow');
			$('.trigger_active').removeClass('trigger_active');
			trig.next('.toggle_container').fadeIn('fast');
			trig.addClass('trigger_active');
			};
			return false;
		});
       },
        
        setContacts: function() {
        	vinWidth = $("body").width();
			vinHeight = $("body").height();
			pageWidth = vinHeight * 1.35 + "px";
			
			$("img.full").css("height", vinHeight * 0.944);
			$("#smartphone_page").css("width", pageWidth);
			var rowCount = $('#smartphone_links div').length;
        },
        
        setText: function() {
           $(".linkSmartphone").fitText(1.0);
           $(".trigger").fitText(2.0);
           $("h4").fitText(2.0);
        },
        
        initialize: function(){
            
            this.template = _.template(template, {} ); 
            this.contactsList();
        },
        
        
        
        contactsList: function(){
            // fyi:
        	// by convention, we make a private 'that' variable. 
        	// 'this' is used to make the object available to the private methods
        	var that = this;
        	
           	this.collection = new CollectionContacts(); 
           	
        	this.collection.fetch({
                success: function(collection) {
                    // comparator for sorting by start contacts
                    collection.comparator = function(model) {
                        return model.get('start');
                    };
                    collection.sort('start'); // sorting ASC
                    //collection.models = collection.models.reverse(); // DESC
                    //collection.trigger('reset', collection, {}); // info that collection has changed (reverse)
                    
                    var divider = ""; // helping variable
                    // loop 
                    collection.each( function(model){
                        // converting
                       
                        
                        // send model data to template
                        that.contactsListItem += _.template(contactsListItem, { model: model.attributes } );                    
                    });
                    
                }
            }); 
        },
        
        contactsSecondLevel: function(id){
            // read model and send data to template
            var model = this.collection.where({"id": parseInt(id)});
            
            model = model[0];

            this.contactsDetail = _.template(contactsDetail, { model: model.attributes } );
            
            // render detail view
            $(this.el).html(this.contactsDetail).trigger('create');  
        },
        
        contactsFirstLevel: function(){
            // render the view   
     
            $(this.el).html(this.template).trigger('create');           // if you generate NEW markup (e.g. ajax-load) you have to trigger the create event again
            $(this.ul).append(this.contactsListItem).listview('refresh');   // refresh is almost the same like 'create', the difference is that the markup already exists
            this.setContacts();
            this.toggleContainer();
            this.setText();
           
           //fit texts
           
           
           

        }
        
    });
    
    return new View();
        
});
