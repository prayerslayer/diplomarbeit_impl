/*
*	Read Comments View
*	===================
*
*	This view lists a bunch of comments and shows some badges in the visualization.
*
*	@author npiccolotto
*/


var assistance = assistance || {};

( function( $ ) {
	assistance.ReadCommentsView = Backbone.Marionette.CollectionView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		itemView: assistance.CommentView,

		badges: new assistance.CommentBadgeCollection(),
		badgesviews: [],	// we need to maintain these views ourselves because the actual collection are the comments
							// could probably be fixed later by using a CompositeView.


		initialize: function() {
			// this event tells that a badge was clicked, its comments shall therefore be shown
			this.listenTo( this.badges, "showcomments", this.showComments, this );
		},

		init: function() {
			// create a spinner before fetching comments
			var spinner = new assistance.Spinner({
					"caller": this.$el
				}),
				that = this;
			// load data
			this.collection.fetch({
				"success": function( collection, response ) {
					spinner.close();


					// collect point annotations
					var point_commies = {};
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
					
					// now create and render badges
					_.each( point_commies, function( comments , uri ) {
						var badge = new assistance.CommentBadge({
							"component": that.options.component,
							"uri": uri,
							"comments": comments
						});
						var badgeview = new assistance.CommentBadgeView({
							"model": badge	
						});
						that.badgesviews.push( badgeview );
						that.badges.add( badge );						
					});
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});

		},

		// hides all the comments, then shows those that should be visible
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
					c.trigger( "hide" );	// to make a change visible
					c.trigger( "show" );
				});
			}
			
		},
		// before closing this view, we must free the badge views to prevent zombie views and memory leaks
		onBeforeClose: function() {
			_.each( this.badgesviews, function( v ) {
				v.stopListening();
				v.close();
			});
			this.badgesviews = null;
		}
	});
})( jQuery );