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
			var comp = d3.select( this.collection.at(0).get( "component" ) ),
				$comp = $( comp.node() ),
				comp_offset = $comp.offset();

			// make dark background
			var ground = $( document.createElement( "div" ) )
							.css( "width", $comp.width() )
							.css( "height", $comp.height() )
							.attr( "class", "vizboard-ground" );
			$comp.prepend( ground );
			
			// create a new div with class rootcopy
			var domDiv = document.createElement( "div" ),
				$div = $( domDiv ),	// wrapped in jquery
				div = d3.select( domDiv );	// wrapped in d3

			$div.addClass( "vizboard-rootcopy" );
			$div.attr( "data-vizboard-component", this.collection.at(0).get("component").substring(1) ); // in case there are more help views open
			$( "body" ).append( $div );
			// make this rootcopy the same size as component and overlay it
			$div.css( "width", $comp.width() );
			$div.css( "height", $comp.height() );
			$div.position({
				"at": $comp,
				"my": "left top",
				"at": "left top"
			});

			// append an svg element to rootcopy
			// this is necessary because the css selectors might hit elements of the visualization
			// which in turn may be an svg element

			var domSvg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" ),
				svg = d3.select( domSvg ),
				$svg = $( svg.node() );

			// make svg the same width and height as rootcopy
			var $visualization = $comp.find( this.collection.at(0).get( "visualization" ) );
			svg.attr( "width", $visualization.width() );
			svg.attr( "height", $visualization.height() );
			$svg.css( "position", "absolute" );
			// jquery.position does not work well with svg, so we do it ourselves
			this.samePosition( $visualization, $svg );
			$div.append( $svg );

			// make a global selector to preserve at least SOME markup order
			// don't know if it works in all cases, it did when dealing with nth-child(even) and nth-child(odd) selectors.

			var modelselektor = {},
				selectorAll = "";
			_.each( this.collection.models, function( m, i ) {
				var selector = m.get( "elements" );
				modelselektor[ selector ] = m;
				selectorAll += ( i > 0 ? ", " : "" ) + selector;
			});

			// now copy relevant elements in rootcopy and position them

			var cpys = comp.selectAll( selectorAll );
			cpys.each( function( d, i ) {
				var original = d3.select( this ),
					cpy = original.clone();	// jquery won't copy SVG elements...

				// this attribute is later used of the item views in highlighting
				original.attr( "data-vizboard-copy", "copy" + i );
				cpy.attr( "data-vizboard-copy", "copy" + i );
				// put svg elements in svg
				if ( assistance.Utility.isSvgElement( cpy.node() ) )
					svg.appendChild( cpy );
				else
					div.appendChild( cpy );

				// find model, it's needed for event triggering
				var $cpy = $( cpy.node() ),
					m = _.find( modelselektor, function( v, k ) {
						return _.contains( comp.selectAll( k )[0], original.node() );
					});

				// I argue that svg elements already have their position set in form of transform or x,y attributes
				if ( !assistance.Utility.isSvgElement( cpy.node() ) ) {
					// so only html elements need positioning
					$cpy.css( "position", "absolute" );
					that.samePosition( $( original.node() ), $cpy );
				}

				//attach event handler
				cpy.attr( "class", "vizboard-relevant-element" );
				$cpy.click( function() {
					m.trigger( "showassistance" );
				});
				$cpy.hover( function() {
					m.trigger( "highlight" );
				}, function() {
					m.trigger( "unhighlight" );
				});
			});
		},

		samePosition: function( $source, $target ) {
			// this works because source and target have equally sized and positioned parents
			// also: offsetTop uses top as well as margin-top
			$target.css( "top", $source[0].offsetTop );
			$target.css( "left", $source[0].offsetLeft );
		},

		onBeforeClose: function() {
			this.collection.unlock();
			var comp_id = this.collection.at(0).get( "component" ),
				comp = d3.select( comp_id );
			
			// clean component up
			comp.selectAll( "[data-vizboard-copy]" ).each( function() {
				d3.select( this ).attr( "data-vizboard-copy", null );
			});
			comp.selectAll("div.vizboard-ground").remove( );
			$( ".vizboard-rootcopy[data-vizboard-component=" + comp_id.substring(1) + "]" ).remove();
		}
	});
})( jQuery );