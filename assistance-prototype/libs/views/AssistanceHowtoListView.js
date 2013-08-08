var assistance = assistance || {};

( function( $ ) {
	assistance.HowtoListView = Backbone.View.extend( {

		tagName: "div",
		className: "assistance-howto__list",

		// positions this view next to the selector
		position: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset(),
				position_left = offset.left < 200,
				left = (position_left ? offset.left + $bro.width() : offset.left ) + 20;

			this.$el.css( "left", left );
			this.$el.css( "top", offset.top );
			this.$el.css( "height", $bro.height() );
		},

		initialize: function() {
			this.render();
		},
		render: function() {
			var that = this;
			_.each( this.model.models, function( item ) {
				var view = new assistance.HowtoItemView({
					model: item
				});
				view.render();
				that.$el.append( view.el );
			});
			return this;
		}
	});
})( jQuery );