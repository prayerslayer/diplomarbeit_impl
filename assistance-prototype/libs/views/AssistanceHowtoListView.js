var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoListView = Backbone.Marionette.CollectionView.extend({

		tagName: "ul",
		className: "assistance-howto__list",
		//template: "#listViewTemplate",
		itemView: assistance.HowtoItemView,
		locked: false,	// this is true when a comic is displayed

		lock: function() {
			this.locked = true;
		},

		unlock: function() {
			this.locked = false;
		}


	});
})( jQuery );