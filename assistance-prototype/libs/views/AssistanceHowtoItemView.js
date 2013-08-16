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

		showAssistance: function() {
			//TODO show comic
			this.model.collection.lock();
		},

		highlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;

			var eels = d3.selectAll( this.model.get( "elements") ),
				viz = d3.select( this.model.get( "visualization" ) ),
				$viz= $( viz.node() ),
				root = d3.select( this.model.get( "visualization_root" ) ),
				$root = $( this.model.get( "visualization_root" ) ),
				root_offset = $root.offset();

			// make dark background
			var ground = $( document.createElement( "div" ) )
							.css( "width", $root.width() )
							.css( "height", $root.height() )
							.attr( "class", "vizboard-ground" );
			$viz.prepend( ground );
			// shallow copy of  visualization_root - this is because we don't know (and don't want to) if it's a HTML or SVG visualization
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

		unhighlightElements: function() {
			if ( this.model.get( "lock" ) )
				return;

			var viz = d3.select( this.model.get( "visualization" ) ),
				root = d3.select( this.model.get( "visualization_root" ) );
			
			viz.selectAll("div.vizboard-ground").remove( );
			viz.selectAll(".vizboard-copy").remove();
			viz.selectAll(".vizboard-rootcopy" ).remove();
		}

	});
})(jQuery);