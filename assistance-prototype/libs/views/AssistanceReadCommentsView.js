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

		initialize: function() {
			// this event tells that a badge was clicked, its comments shall therefore be shown
			this.listenTo( this.badges, "showcomments", this.showComments, this );
			// render badges after annotations
			this.on( "render", this.renderBadges, this );
			this.on( "itemview:showannotations", this.hideBadges, this );
			this.on( "itemview:hideannotations", this.showBadges, this );
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

					collection.each( function( comment ) {
						comment.set( "component", that.options.component ); //komponente durchreichen
					});


					that.render(); // it's necessary so that the itemviews know the component in which they shall render themselves
					console.log( "annotations rendered" );
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});

		},

		renderBadges: function() {
			// collect point annotations
			console.log( "rendering badges" );
			var point_commies = {},
				that = this;
			this.collection.each( function( comment ) {
				comment.get( "annotations" ).each( function( anno ) {
					if ( anno.get( "type" ) === "point" ) {
						var uri = anno.get( "uri" );
						if ( !point_commies[ uri ] )
							point_commies[ uri ] = [ comment ];
						else 
							point_commies[ uri ].push( comment );
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

		hideBadges: function() {
			_.each( this.badgesviews, function( v ) {
				v.hide( 200 );
			});
		},

		showBadges: function() {
			_.each( this.badgesviews, function( v ) {
				v.show( 200 );
			});
		},

		// hides all the comments, then shows those that should be visible
		showComments: function( comments ) {
			var that = this;
			if ( comments.length > 0 ) {
				this.children.call( "hide" );
				_.each( this.collection.models, function( c ) {
					if ( _.contains( comments, c ) ) {
						that.children.findByModel( c ).show();
					}
				});	
			} else {
				// there are no comments to be shown, so show all.
				this.children.call( "hide" );	// to make a change visible
				this.children.call( "show" );
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