/*
	Howto Item View
=======================	
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
			this.$el.removeClass( "assistance-howto__item_selected" );
		},

		// creates a comic view and displays it
		showAssistance: function() {
			var that = this;
			if ( this.model.get( "lock" ) )
				return;
			this.model.collection.lock();
			this.model.set( "displayed", true );
			this.$el.addClass( "assistance-howto__item_selected" );
			var task = _.template( $( this.template ).html(), this.model.attributes );
			// fake http request
			var spinner = new assistance.Spinner({
				"caller": this.$el
			});
			setTimeout( function() {
				spinner.close();

				var data = {
				    "initial": "http://baconmockup.com/400/400/",
				    "result": "http://baconmockup.com/1000/750/",
				    "operations": [{
				        "url": "http://s10.postimg.org/fc6iv6rp5/testimage.png",
				        "bbox": [42.14, 15.35, 48.97, 44.76],
				        "operation": "click"
				    }
				    /*, {
				        "url": "http://s2.postimg.org/zdbyhgfk9/testimage2.png",
				        "bbox": [ 48.16, 25.91, 44.57, 45.3 ],
				        "operation": "double click"
				    }*/
				        ]
				};

				// create a normal base view if images do not fit inside component
				var component = that.model.get( "component" );
				if ( $( component ).width() < (2+data.operations.length)*170 ) {
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
					"data": data,
					"creator": that.model
				});
				that.comic.content.show( comic_view );

			}, 200 );
		},

		// highlights relevant UI elements
		highlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;

			var eels = d3.selectAll( this.model.get( "elements") ),
				viz = d3.select( this.model.get( "component" ) ),
				$viz= $( viz.node() ),
				root = d3.select( this.model.get( "visualization" ) ),
				$root = $( this.model.get( "visualization" ) ),
				root_offset = $root.offset();

			// make dark background
			var ground = $( document.createElement( "div" ) )
							.css( "width", $root.width() )
							.css( "height", $root.height() )
							.attr( "class", "vizboard-ground" );
			$viz.prepend( ground );
			// shallow copy of  visualization - this is because we don't know (and don't want to) if it's a HTML or SVG visualization
			var copyroot = root.clone( false );
			// prepend to visualization
			viz.appendChild( copyroot );
			copyroot.attr( "class", "vizboard-rootcopy" );
			$( copyroot.node() ).css( "left", root_offset.left );
			$( copyroot.node() ).css( "top", root_offset.top );

			// now copy relevant elements and display them above
			eels.each( function() {
				var cpy = d3.select( this ).clone(),
					off = $( cpy.node() ).offset();
				copyroot.appendChild( cpy );
				cpy.attr( "class", "vizboard-copy" );
			});
		},

		// unhighlights highlighted elements
		unhighlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;

			var viz = d3.select( this.model.get( "component" ) ),
				root = d3.select( this.model.get( "visualization" ) );
			
			viz.selectAll("div.vizboard-ground").remove( );
			viz.selectAll(".vizboard-copy").remove();
			viz.selectAll(".vizboard-rootcopy" ).remove();
		}

	});
})(jQuery);