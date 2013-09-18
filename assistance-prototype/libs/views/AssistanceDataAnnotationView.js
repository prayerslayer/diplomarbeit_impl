/*
*	Data Annotation View
*	===================
*
*	Displays an Rectangle annotation (data based).
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.DataAnnotationView = Backbone.Marionette.ItemView.extend({
		
		tagName: "svg",
		className: "assistance-comment__dataannotation",
		template: "#dataannotationViewTemplate",

		ui: {
			"mask": "defs > mask",
			"bg": ".assistance-comment__dataannotation-bg"
		},

		initialize: function( opts ) {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			//downside: need to re-do everyting that the template was supposed to do manually
			d3.select( this.el )
				.attr( "class", this.className );
			var def = d3.select( this.el ).append( "defs" );
			var mask = def.append( "mask" );
			mask.attr( "id", this.cid + "mask" );
			var maskBg = mask.append( "rect" );
			maskBg.attr( "id", this.cid + "maskBg" );
			// see http://stackoverflow.com/questions/11404391/invert-svg-clip-show-only-outside-path?lq=1
			maskBg.style( "fill", "white" );
			maskBg.attr( "width", "100%" );
			maskBg.attr( "height", "100%" );
			var bg = d3.select( this.el ).append( "rect" );
			bg.attr( "x", 0 );
			bg.attr( "y", 0 );
			bg.attr( "mask", "url(#" + this.cid + "mask)" );

			bg.attr( "class", this.className + "-bg" );

			this.$el = $( this.el );
			this.bindUIElements(); // because we completely re-did the component
		},

		onRender: function() {
			var $comp = $( this.model.get( "component" ) ).first(),
				$vis = $comp.find( this.model.get( "visualization" ) ).first();
			
			var bbox = assistance.Utility.insideBoundingBox( $comp, $vis );

			// resize background and svg element to visualization
			this.ui.bg.attr( "width", bbox.width );
			this.ui.bg.attr( "height", bbox.height );
			this.$el.css( "width", bbox.width );
			this.$el.css( "height", bbox.height );
			this.$el.css( "top", bbox.y );
			this.$el.css( "left", bbox.x );

			// append rect for data annotation
			d3.select( this.ui.mask[ 0 ] )
				.append( "rect" )
				.attr( "id", "data_anno-" + this.cid );

			this.hide();
		},

		show: function() {
			// call component for appropriate coordinates
			var ref = this.model.get( "reference" ),
				bbox = ref.dataToCoordinates.apply( ref, this.model.get( "items" ) );

			d3.select( "#data_anno-" + this.cid )
				.attr( "x", bbox.x1 )
				.attr( "y", bbox.y1 )
				.attr( "width", bbox.x2 - bbox.x1 )
				.attr( "height", bbox.y2 - bbox.y1 );

			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		}

	});
})( jQuery );