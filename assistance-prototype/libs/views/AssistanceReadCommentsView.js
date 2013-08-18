var assistance = assistance || {};

( function( $ ) {
	assistance.ReadCommentsView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		itemView: assistance.CommentView,

		badges: [],

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
						badgeview.on( "showcomments", that.showComments, that );
						badgeview.on( "hidecomments", that.hideComments, that );
						that.badges.push( badgeview );						
					});
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});

		},

		showComments: function( comments ) {
			console.log( "show", comments );
			_.each( this.collection.models, function( c ) {
				if ( !_.contains( comments, c ) ) {
					c.trigger( "hide" );
				}
			});
		},

		hideComments: function( comments ) {
			console.log( "hide", comments );
		},

		onBeforeClose: function() {
			// destroy badges
			_.each( this.badges, function( b ) {
				b.close();
			});
			this.badges = null;
		}
	});
})( jQuery );