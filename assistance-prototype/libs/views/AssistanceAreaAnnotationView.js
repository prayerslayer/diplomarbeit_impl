/*
*	Area Annotation View
*	===================
*
*	The parent view of all area annotations (an svg element). It defines masks and marker.
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.AreaAnnotationView = Backbone.Marionette.CollectionView.extend({
		tagName: "svg",
		className: "assistance-comment__areaannotation",

		ui: {
			"mask": "defs > mask",
			"bg": "rect.assistance-comment__areaannotation-bg"
		},
		
		getItemView: function( item ) {
			var type = item.get( "type" );
			if ( type === "text" ) 
				return assistance.TextAnnotationView;
			if ( type === "arrow" )
				return assistance.ArrowAnnotationView;
			if ( type === "rectangle" )
				return assistance.RectangleAnnotationView;
		},

		appendHtml: function( collectionview, itemview, index ) {
			// currently used only for arrows, they need to reference the arrowhead
			if ( typeof itemview.setParent === 'function')
				itemview.setParent( this.cid );

			if ( itemview.model.get( "type" ) === "rectangle" ) {
				// this is the mask path in defs
				collectionview.ui.mask.append( itemview.el );
			}
			else {
				collectionview.$el.append( itemview.el );
			}
		},

		onRender: function() {
			var $comp = $( this.model.get( "component" ) ).first(),
				$vis = $comp.find( this.model.get( "visualization" ) ).first();
			
			this.ui.bg.attr( "width", $vis.width() );
			this.ui.bg.attr( "height", $vis.height() );
			this.$el.css( "width", $vis.width() );
			this.$el.css( "height", $vis.height() );
			this.$el.css( "top", $vis[0].offsetTop );
			this.$el.css( "left", $vis[0].offsetLeft );

			this.$el.hide();
		},

		show: function() {
			// would like to have this in onRender, but apparently it doesn't work so well
			if ( !this.model.hasRects() )
				d3.select( "#" + this.cid + "maskBg" ).style( "fill", "black" );
			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		},

		initialize: function( opts ) {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			//downside: need to re-do everyting that the template was supposed to do manually
			d3.select( this.el ).attr( "class", "assistance-comment__areaannotation" );
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

			var marker = def.append( "marker" );
			marker.attr( "id", this.cid + "arrowhead" )
					.attr("refX", 5) /*must be smarter way to calculate shift*/
    				.attr("refY", 3)
    				.attr( "fill", "black" )
				    .attr("markerWidth", 6)
				    .attr("markerHeight", 6)
				    .attr("orient", "auto")
				    .append("path")
        				.attr("d", "M 0,0 V 6 L6,3 Z");

			bg.attr( "class", "assistance-comment__areaannotation-bg" );

			this.$el = $( this.el );
			this.collection = opts.model.get( "elements" );
			this.model.on( "change:visualization", this.render, this );
			this.model.on( "change:component", this.render, this );

			this.bindUIElements(); // because we completely re-did the component
	
		}
	});
})( jQuery );