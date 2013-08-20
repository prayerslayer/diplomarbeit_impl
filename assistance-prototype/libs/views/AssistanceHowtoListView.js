/*
	Howto List View
=======================	
 	Displays the Howto Items and highlights relevant UI elements of the component.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoListView = Backbone.Marionette.CollectionView.extend({

		tagName: "div",
		className: "assistance-howto__list",
		itemView: assistance.HowtoItemView,

		init: function() {
			var that = this;

			// highlight these elements
			var viz = d3.select( this.collection.at(0).get( "component" ) ),
				$viz = $( viz.node() ),
				root = d3.select( this.collection.at(0).get( "visualization" ) ),
				$root = $( this.collection.at(0).get( "visualization" ) ),
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
			//TODO problem: reihenfolge passt nicht
			var modelselektor = {},
				selectorAll = "";
			_.each( this.collection.models, function( m, i ) {
				var selector = m.get( "elements" );
				modelselektor[ selector ] = m;
				selectorAll += ( i > 0 ? ", " : "" ) + selector;
			});

			var cpys = viz.selectAll( selectorAll );
			cpys.each( function( ) {
				var cpy = d3.select( this ).clone();
				copyroot.appendChild( cpy );
				cpy.attr( "class", "vizboard-relevant-element" );
				//wrap in jquery and attach event handler
				var $cpy = $( cpy.node() ),
					m = _.find( modelselektor, function( v, k ) {
						return _.contains( viz.selectAll( k )[0], cpy.node() );
					});
				$cpy.click( function() {
					m.trigger( "showassistance" );
				});
				$cpy.hover( function() {
					m.trigger( "highlight" );
				}, function() {
					m.trigger( "unhighlight" );
				});
			})
		},

		onBeforeClose: function() {
			this.collection.unlock();
			var viz = d3.select( this.collection.at(0).get( "component" ) ),
				root = d3.select( this.collection.at(0).get( "visualization" ) );
			
			viz.selectAll("div.vizboard-ground").remove( );
			viz.selectAll(".vizboard-rootcopy" ).remove();
		}
	});
})( jQuery );