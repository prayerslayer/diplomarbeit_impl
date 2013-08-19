var assistance = assistance || {};

( function( $ ) {
	assistance.ReadCommentsView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		itemView: assistance.CommentView,

		badges: new assistance.CommentBadgeCollection(),

		initialize: function() {
			this.listenTo( this.badges, "showcomments", this.showComments, this );
		},

		init: function() {
			var spinner = new assistance.Spinner({
					"caller": this.$el
				}),
				that = this;
			// load data
			this.collection.fetch({
				"success": function( collection, response ) {
					spinner.close();

					var point_commies = {};
					// collect point annotations
					_.each( collection.models, function( comment ) {
						_.each( comment.get( "annotations" ), function( anno ) {
							if ( anno.type === "point" ) {
								if ( !point_commies[ anno.uri ] )
									point_commies[ anno.uri ] = [ comment ];
								else 
									point_commies[ anno.uri ].push( comment );
							}
						});
					});
					
					// draw badges
					_.each( point_commies, function( comments , uri ) {
						var badge = new assistance.CommentBadge({
							"component": that.options.component,
							"uri": uri,
							"comments": comments
						});
						var badgeview = new assistance.CommentBadgeView({
							"model": badge	
						});
						that.badges.add( badge );						
					});
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});

		},

		showComments: function( comments ) {
			if ( comments.length > 0 ) {
				_.each( this.collection.models, function( c ) {
					c.trigger( "hide" );
					if ( _.contains( comments, c ) ) {
						c.trigger( "show" );
					}
				});	
			} else {
				// there are no comments to be shown, so show all.
				_.each( this.collection.models, function( c ) {
					c.trigger( "hide" );	// to make the change visible
					c.trigger( "show" );
				});
			}
			
		}
	});
})( jQuery );