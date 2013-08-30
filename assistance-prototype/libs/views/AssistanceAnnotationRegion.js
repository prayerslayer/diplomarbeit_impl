/*
 *	Annotation Region
 *	=====================
 *
 *	An Annotation Region is practically the same as a default Marionette Region, but it doesn't delete existing elements.
 *
 *	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.AnnotationRegion = Backbone.Marionette.Region.extend({

		// overwrite as this annotationregion should not behave in the way that it deletes what's already inside!
		open: function( view ){
			this.$el.append( view.el );
			var $el = view.$el,
				$v = this.$el.find( this.options.visualization );

			// make it the same size as component
			$el.css( "width", "100%");
			$el.css( "height",  "100%" );
			$el.css( "top", 0 );
			$el.css( "left", 0 );
		}
	});
})( jQuery );