/*
	Howto Item View
	====================	
 	
 	Look and feel of Howto Items. They highlight elements at mouseover and display assistance on click.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItemView = Marionette.ItemView.extend({

		tagName: "div",
		className: "assistance-howto__item",

		template: "#howtoItemTemplate",

		events: {
			"click": "showAssistance",
			"mouseover": "highlightElements",
			"mouseout": "unhighlightElements"
		},

		comic: null,

		initialize: function() {
			this.model.collection.bind( "unlocked", this.clear, this );
			this.listenTo( this.model, "showassistance", this.showAssistance );
			this.listenTo( this.model, "highlight", this.highlightSelf );
			this.listenTo( this.model, "unhighlight", this.unhighlightSelf );
		},

		clear: function() {
			if ( this.model.get( "displayed" ) ) {
				this.unhighlightElements();
				this.model.set( "displayed", false );
				if ( this.comic ) {
					this.comic.close();
					this.comic = null;	// prevent zombie view
				}
			}
			this.unhighlightSelf();
		},

		// creates a comic view and displays it
		showAssistance: function() {
			var that = this;
			if ( this.model.get( "lock" ) )
				return;
			this.model.collection.lock();
			this.model.set( "displayed", true );
			this.highlightSelf();
			var task = _.template( $( this.template ).html(), this.model.attributes );
			// fake http request
			var spinner = new assistance.Spinner({
				"caller": this.$el
			});

			var panelCollection = new assistance.PanelCollection([], {
				"url": "componentCapability"
			});
			panelCollection.task = task;
			panelCollection.fetch({
				"success": function( collection, res ) {
					spinner.close();

					// create a normal base view if images do not fit inside component
					var component = that.model.get( "component" );
					if ( $( component ).width() < collection.size() * 170 ) {
						that.comic = new assistance.BaseView({
							"type": "comic",
							"headline": task,
							"component": component
						});
						that.comic.overlay( component );
						that.comic.$el.css( "width", "auto" );
					} else {
						that.comic = new assistance.ComicBaseView({
							"type": "comic",
							"headline": task,
							"component": component
						});
					}
					// show comic view
					var comic_view = new assistance.ComicView({
						"component_id": that.model.get( "component_id" ),
						"capability": that.model.get( "capability" ),
						"task": task,
						"collection": collection,
						"creator": that.model
					});
					that.comic.content.show( comic_view );
					},
					"error": function( col, res, opt ) {
						console.debug( col, res, opt );
					}
			});			
		},

		highlightSelf: function() {
			this.$el.addClass( "assistance-howto__item_selected" );
		},

		unhighlightSelf: function() {
			this.$el.removeClass( "assistance-howto__item_selected" );
		},

		// highlights relevant UI elements
		highlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;
			this.highlightSelf();
			var eels = d3.selectAll( ".vizboard-rootcopy[data-vizboard-component=" + this.model.get( "component" ).substring(1) + "] " + this.model.get( "elements") );
			// not necessary to remember original class since these elements are a copy anyway
			eels.attr( "class", "vizboard-highlight" );
		},

		// unhighlights highlighted elements
		unhighlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;
			this.unhighlightSelf();
			var eels = d3.selectAll( ".vizboard-rootcopy[data-vizboard-component=" + this.model.get( "component" ).substring(1) + "] " + this.model.get( "elements") );
			eels.attr("class", "vizboard-relevant-element" );
		}

	});
})(jQuery);