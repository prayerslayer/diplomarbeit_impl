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
			"clip": "clipPath"
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

		doAfterRender: function() {
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
			var clip = def.append( "clipPath" );
			clip.attr( "id", "clip" );
			this.$el = $( this.el );
			this.collection = opts.model.get( "elements" );
			this.on( "collection:rendered", this.doAfterRender, this );

			this.bindUIElements();
		}
	});
})( jQuery );