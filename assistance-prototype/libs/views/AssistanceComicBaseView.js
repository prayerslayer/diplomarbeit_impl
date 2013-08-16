var assistance = assistance || {};

( function( $ ) {
	assistance.ComicBaseView = assistance.BaseView.extend({

		className: "assistance-comic", // to prevent round borders

		// position() needs to be overwritten as the comic view is located inside the original, not beneath
		position: function( selector ) {
			var $bro = $( selector ),
				offset = $bro.offset();

			this.$el.css( "left", offset.left );
			this.$el.css( "top", offset.top );
			this.$el.css( "width", $bro.width() );
			this.$el.css( "height", $bro.height() );
		}

	});
})( jQuery );