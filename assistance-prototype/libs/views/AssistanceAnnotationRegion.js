var assistance = assistance || {};

( function( $ ) {
	assistance.AnnotationRegion = Backbone.Marionette.Region.extend({

		// overwrite as this annotationregion should not behave in the way that it deletes what's already inside!
		open: function( view ){
			this.$el.append( view.el );
			var $el = view.$el,
				$v = this.$el.find( this.options.visualization );

			$el.css( "width", $v.width() );
			$el.css( "height", $v.height() );
			$el.css( "top", $v[0].offsetTop );
			$el.css( "left", $v[0].offsetLeft );
		}
	});
})( jQuery );