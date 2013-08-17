/*
	Howto List View
=======================	
 	Displays the Howto Items. Does not much else.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoListView = Backbone.Marionette.CollectionView.extend({

		tagName: "ul",
		className: "assistance-howto__list",
		itemView: assistance.HowtoItemView


	});
})( jQuery );