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
		template: "#areaannotationViewTemplate",

		getItemView: function( item ) {
			if ( item.get( "type" ) === "text" )
				return assistance.TextAnnotationView;
		},

		appendHtml: function( colview, itemview, index ) {
			$( "body" ).append( itemview.el );
		}
	});
})( jQuery );