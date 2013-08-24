var assistance = assistance || {};

( function( $ ) {
	assistance.AnnotationRegion = Backbone.Marionette.Region.extend({

		// overwrite as this annotationregion should not behave in the way that it deletes what's already inside!
		open: function( view ){
			this.$el.append( view.el );
			var $el = view.$el,
				$v = this.$el.find( this.options.visualization );

			$el.css( "width", "100%");
			$el.css( "height",  "100%" );
			$el.css( "top", 0 );
			$el.css( "left", 0 );
		}
	});
})( jQuery );