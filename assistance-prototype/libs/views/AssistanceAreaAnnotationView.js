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
		tagName: "div",
		className: "assistance-comment__areaannotation",
		
		getItemView: function( item ) {
			if ( item.get( "type" ) === "text" ) 
				return assistance.TextAnnotationView;
		},

		onRender: function() {
			this.$el.hide();
		},

		show: function() {
			this.$el.show();
		},

		hide: function() {
			this.$el.hide();
		},

		initialize: function( opts ) {
			this.collection = opts.model.get( "elements" );
		}
	});
})( jQuery );