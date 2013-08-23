/*
	Base View
=======================	
 	Holds default look and feel of the help system, e.g. a close button and round borders on a dark background.
 	
	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.BaseView = Backbone.Marionette.Layout.extend({
		tagName: "div",
		className: "assistance-base",

		template: "#baseViewTemplate",

		events: {
			"click [data-action='close']": "close"
		},

		ui: {
			"headline": "h2:first-child",
			"explanation": ".assistance-base__explanation"
		},

		regions: {
			"content": "div.assistance-base__content"
		},

		initialize: function() {
			this.render();
		},

		default_content: {
			"howto": {
				"headline": "How to",
				"explanation": "Learn how to accomplish these tasks:"
			},
			"comic": {
				"headline": "Explanation",
				"explanation": "These pictures show you how to achieve this task."
			},
			"readcomment": {
				"headline": "Read comments",
				"explanation": ""
			},
			"writecomment": {
				"headline": "Write comment",
				"explanation": "Annotate your comment with the following tools:"
			}
		},

		onRender: function() {
			// fill view with content
			this.ui.headline.text( this.options.headline || this.default_content[ this.options.type ].headline );
			this.ui.explanation.text( this.options.explanation || this.default_content[ this.options.type ].explanation );
			// show base view
			$( "body" ).append( this.el );
			this.position( this.options.component );
			// init view when it's to be shown
			this.content.on( "show", function( view ) {
				if ( typeof view.init === 'function' )
					view.init();
			});
			
			// width in css is for list view
			if ( this.options.type !== "howto" )
				this.$el.css( "width", "auto" ); // I KNOOOW decoupling css and js and so forth... would be more elegant w/ class
		},

		// positions this view next to the selector
		position: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset(),
				position_left = offset.left > $(window).width() - offset.left - $bro.width();

			this.$el.position({
				"of": $bro,
				"my": position_left ? "right center": "left center",
				"at": position_left ? "left center" : "right center"
			});
		},

		// centers this view at the center of selector element
		overlay: function( selector ) {
			var $bro = $( selector );

			this.$el.position({
				"of": $bro,
				"my": "center center",
				"at": "center center"
			});
		},

		// animate removal
		remove: function(){
		  this.$el.fadeOut(function(){
		    $(this).remove();
		  }); 
		}
	});
})( jQuery );