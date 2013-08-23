/*
*	Area Annotation View
*	===================
*
*	Does what you would expect...
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
			if ( type === "rect" )
				return assistance.RectangleAnnotationView;
		},

		appendHtml: function( collectionview, itemview, index ) {
			if ( itemview.model.get( "type" ) === "rect" ) {
				// this is the mask path in defs
				collectionview.ui.mask.append( itemview.el );
			}
			else
				collectionview.$el.append( itemview.el );
		},

		doAfterRender: function() {
			console.log( this.model.attributes );
			var $comp = $( this.model.get( "component" ) ).first(),
				$vis = $comp.find( this.model.get( "visualization" ) ).first();
			console.log( $comp, $vis );
			this.ui.bg.attr( "width", $vis.width() );
			this.ui.bg.attr( "height", $vis.height() );
			this.$el.css( "width", $vis.width() );
			this.$el.css( "height", $vis.height() );
			this.$el.css( "top", $vis[0].offsetTop );
			this.$el.css( "left", $vis[0].offsetLeft );
			this.$el.hide();
		},

		show: function() {
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
			mask.attr( "id", "mask" );
			var maskBg = mask.append( "rect" );
			// see http://stackoverflow.com/questions/11404391/invert-svg-clip-show-only-outside-path?lq=1
			maskBg.style( "fill", "white" );
			maskBg.attr( "width", "100%" );
			maskBg.attr( "height", "100%" );
			var bg = d3.select( this.el ).append( "rect" );
			bg.attr( "x", 0 );
			bg.attr( "y", 0 );
			bg.attr( "mask", "url(#mask)" );

			bg.attr( "class", "assistance-comment__areaannotation-bg" );

			this.$el = $( this.el );
			this.collection = opts.model.get( "elements" );
			this.model.on( "change:visualization", this.render, this );
			this.model.on( "change:component", this.render, this );
			this.on( "render", this.doAfterRender, this );

			this.bindUIElements(); // because we completely re-did the component
	
		}
	});
})( jQuery );