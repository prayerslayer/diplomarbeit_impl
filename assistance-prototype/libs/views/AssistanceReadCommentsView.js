var assistance = assistance || {};

( function( $ ) {
	assistance.ReadCommentsView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		itemView: assistance.CommentView,

		init: function() {
			var spinner = new assistance.Spinner({
					"caller": this.$el
				}),
				that = this;
			// load data
			this.collection.fetch({
				"success": function( collection, response ) {
					spinner.close();

					var point_annos = {};
					// collect point annotations
					_.each( collection.models, function( comment ) {
						_.each( comment.get( "annotations" ), function( anno ) {
							if ( anno.type === "point" ) {
								if ( !point_annos[ anno.uri ] )
									point_annos[ anno.uri ] = [ anno ];
								else 
									point_annos[ anno.uri ].push( anno );
							}
						});
					});
					//TODO badges in eigenen view auslagern
					// draw badges
					_.each( point_annos, function( annos , uri ) {
						var badge = $( document.createElement( "div" ) );
						badge.text( annos.length );
						badge.addClass( "vizboard-badge" );
						$( that.options.component ).append( badge );
						badge.position({
							"of": $( "[resource=" + uri + "]" ),
							"my": "center center",
							"at": "right top"
						});
					});
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});

		}
	});
})( jQuery );