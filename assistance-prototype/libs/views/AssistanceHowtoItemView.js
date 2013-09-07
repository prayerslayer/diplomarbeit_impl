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
			"click": "_showAssistance",
			"mouseover": "_highlightElements",
			"mouseout": "_unhighlightElements"
		},

		comic: null,	// the comic view

		initialize: function() {
			this.model.collection.bind( "unlocked", this._clear, this );	// this is triggered by onCLose of ComicView
			this.listenTo( this.model, "showassistance", this._showAssistance );	// this might get triggered by elements of the visualization
			this.listenTo( this.model, "highlight", this._highlightSelf );
			this.listenTo( this.model, "unhighlight", this._unhighlightSelf );
		},

		// reset presentation state
		_clear: function() {
			if ( this.model.get( "displayed" ) ) {	// i know it's bad that the model knows about presentation state, but don't want to change it anymore either.
				this.unhighlightElements();
				this.model.set( "displayed", false );
				if ( this.comic ) {
					this.comic.close();
					this.comic = null;	// prevent zombie view
				}
			}
			this._unhighlightSelf();
		},

		// creates a comic view and displays it
		_showAssistance: function() {
			var that = this;
			if ( this.model.get( "lock" ) )
				return;
			this.model.collection.lock();
			this.model.set( "displayed", true );
			this._highlightSelf();
			var task = _.template( $( this.template ).html(), this.model.attributes );
			// fake http request
			var spinner = new assistance.Spinner({
				"caller": this.$el
			});

			var panelCollection = new assistance.PanelCollection([], {
				"url": this.options.core_url
			});
			panelCollection.task = task;
			panelCollection.fetch({
				"success": function( collection, res ) {
					spinner.close();

					// create a normal base view if images do not fit inside component
					var component = that.model.get( "component" );
					if ( $( component ).width() < collection.size() * 170 ) {	// magic number alert
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
						console.error("error fetching panel collection", col, res, opt );
					}
			});			
		},

		_highlightSelf: function() {
			this.$el.addClass( "assistance-howto__item_selected" );
		},

		_unhighlightSelf: function() {
			this.$el.removeClass( "assistance-howto__item_selected" );
		},

		// highlights relevant UI elements
		highlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;
			var that = this;
			this.highlightSelf();
			var eels = d3.selectAll( this.model.get( "component" ) + " " + this.model.get( "elements") );
			eels.each( function( ) {
				var el = d3.select( this ),
					copy_id = el.attr( "data-vizboard-copy" );

				d3.selectAll( ".vizboard-rootcopy[data-vizboard-component=" + that.model.get( "component" ).substring(1) + "] [data-vizboard-copy=" + copy_id + "]" ).attr( "class", "vizboard-highlight" );
			});
		},

		// unhighlights highlighted elements
		unhighlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;
			var that = this;
			this._unhighlightSelf();
			var eels = d3.selectAll( this.model.get( "component" ) + " " + this.model.get( "elements") );
			eels.each( function( ) {
				var el = d3.select( this ),
					copy_id = el.attr( "data-vizboard-copy" );

				d3.selectAll( ".vizboard-rootcopy[data-vizboard-component=" + that.model.get( "component" ).substring(1) + "] [data-vizboard-copy=" + copy_id + "]" ).attr( "class", "vizboard-relevant-element" );
			});
		}

	});
})(jQuery);