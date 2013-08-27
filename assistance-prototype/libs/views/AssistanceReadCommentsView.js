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
			this.on( "collection:rendered", this.renderBadges, this );
			this.on( "itemview:showannotations", this.hideBadges, this );
			this.on( "itemview:showannotations", this.showAnnos, this );
			this.on( "itemview:hideannotations", this.showBadges, this );
			this.on( "itemview:hideannotations", this.hideAnnos, this );
		},

		showAnnos: function( view ) {
			// hide all
			this.children.call( "hideAnnotations" );
			// show only current
			this.children.findByCid( view.cid ).showAnnotations();
		},

		hideAnnos: function( view ) {
			// hide current
			// this might as well be done in annotationview, but for sake of uniformness it's done here.
			this.children.findByCid( view.cid ).hideAnnotations();
		},

		renderBadges: function() {
			// collect point annotations
			console.log( "rendering badges" );
			var point_commies = {},
				that = this;
			this.collection.each( function( comment ) {
				comment.get( "latest" ).annotations.each( function( anno ) {
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