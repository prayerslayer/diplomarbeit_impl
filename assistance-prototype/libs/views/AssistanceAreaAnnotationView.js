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
			console.log( "annotations rendered" );
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
			this.el.classList.add( "assistance-comment__areaannotation" );
			this.$el = $( this.el );
			this.collection = opts.model.get( "elements" );
			this.on( "collection:rendered", this.doAfterRender, this );
		}
	});
})( jQuery );