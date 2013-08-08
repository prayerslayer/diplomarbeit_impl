var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoItemView = Backbone.View.extend({

		tagName: "div",
		className: "assistance-howto__item",

		initialize: function( ) {
			console.debug( this.options );
			this.render();
		},

		render: function( ) {
			this.$el.html( this.model.get("action" ) + " " + this.model.get("variable"));
			return this;
		},

		events: {
			"click": "showAssistance",
			"mouseover": "highlightElements",
			"mouseout": "unhighlightElements"
		},

		showAssistance: function() {
			
		},

		highlightElements: function() {
			var eels = d3.selectAll( this.model.get( "elements") ),
				viz = d3.select( this.model.get( "viz" ) ),
				$viz= $( viz.node() ),
				root = d3.select( this.model.get( "vizRoot" ) ),
				$root = $( this.model.get( "vizRoot" ) ),
				root_offset = $root.offset();

			// make dark background
			var ground = $( document.createElement( "div" ) )
							.css( "width", $root.width() )
							.css( "height", $root.height() )
							.attr( "class", "vizboard-ground" );
			$viz.prepend( ground );
			// copy vizroot
			var copyroot = root.clone();
			// delete everything
			copyroot.selectAll("*").remove();
			// prepend to visualization
			console.log( copyroot );
			viz.appendChild( copyroot );
			copyroot.attr( "class", "vizboard-rootcopy" );
			$( copyroot.node() ).css( "left", root_offset.left );
			$( copyroot.node() ).css( "top", root_offset.top );

			// now copy relevant elements and display them above
			console.log( eels );
			eels.each( function() {
				var cpy = d3.select( this ).clone(),
					off = $( cpy.node() ).offset();
				copyroot.appendChild( cpy );
				cpy.attr( "class", "vizboard-copy" );
			});

			//root.style( "opacity", 0 );
		},

		unhighlightElements: function() {
			var viz = d3.select( this.model.get( "viz" ) ),
				root = d3.select( this.model.get( "vizRoot" ) );
			
			viz.selectAll("div.vizboard-ground").remove( );
			viz.selectAll(".vizboard-copy").remove();
			viz.selectAll(".vizboard-rootcopy" ).remove();

			//root.style( "opacity", 1 );
		}

	});
})(jQuery);