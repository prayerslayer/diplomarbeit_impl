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
	assistance.ReadCommentsView = Backbone.Marionette.CompositeView.extend({
		tagName: "div",
		className: "assistance-comment__read-comments",
		template: "#readcommentsViewTemplate",
		itemView: assistance.CommentView,
		emptyView: Backbone.Marionette.ItemView.extend({
			template: "#nocommentViewTemplate"
		}),
		badges: new assistance.CommentBadgeCollection(),
		badgesviews: new Backbone.ChildViewContainer(),	// we need to maintain these views ourselves because the actual collection are the comments

		initialize: function() {
			// render badges after annotations
			this.on( "collection:rendered", this.renderBadges, this );
			this.on( "itemview:reply", this.reply, this );
			this.on( "itemview:viewresponse", this.showResponse, this );
			this.on( "itemview:showannotations", this.hideBadges, this );
			this.on( "itemview:showannotations", this.showAnnos, this );
			this.on( "itemview:hideannotations", this.showBadges, this );
			this.on( "itemview:hideannotations", this.hideAnnos, this );
		},

		ui: {
			"back": "div.assistance-comment__back"
		},

		events: {
			"click div.assistance-comment__back": "back"
		},

		appendHtml: function( cView, iView, index ) {
			cView.$el.find( "div.assistance-comment__comments" ).append( iView.el );
		},

		onRender: function() {
			this.ui.back.hide();
		},

		reply: function( view, comment ) {
			this.trigger( "reply", comment );
		},

		showResponse: function( view, response_id ) {
			this.trigger( "rememberscroll" );
			// hide other comments
			this.children.call( "hide" );
			// get response comment
			var response = this.collection.get( response_id );
			if ( !response ) {
				// not in collection
				// should not happen
				console.error( "comment", response_id, "not in collection" );
			}
			// show
			this.children.findByModel( response ).show();
			this.ui.back.show();
			
		},

		back: function( ) {
			this.ui.back.hide();
			this.children.call( "show" );
			var that = this;
			setTimeout( function() {
				that.trigger( "resetscroll" );
			}, 200 );
			
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
					"visualization": that.options.visualization,
					"uri": uri,
					"comments": comments
				});
				var badgeview = new assistance.CommentBadgeView({
					"model": badge	
				});
				that.badgesviews.add( badgeview );
				that.badges.add( badge );
				// as backbone.babysitter does not listen to childview events, we have to attach an event listener to each view ourselves
				badgeview.on( "selectcomments", that.showComments, that );
				badgeview.on( "unselectcomments", that.hideComments, that );					
			});
		},

		hideBadges: function() {
			this.badgesviews.call( "hide" );
		},

		showBadges: function() {
			this.badgesviews.call( "show" );
		},

		hideComments: function( view ) {
			this.children.call( "hide" );	// to make a change visible
			this.children.call( "show" );
		},

		// hides all the comments, then shows those that should be visible
		showComments: function( view ) {
			var that = this;
			this.badgesviews.call( "unselect" );
			view.select();
			var comments = view.model.get( "comments" );
			this.children.call( "hide" );
			_.each( this.collection.models, function( c ) {
				if ( _.contains( comments, c ) ) {
					that.children.findByModel( c ).show();
				}
			});				
		},
		// before closing this view, we must free the badge views to prevent zombie views and memory leaks
		onBeforeClose: function() {
			this.badgesviews.call( "stopListening" );
			this.badgesviews.call( "close" );
			this.badgesviews = null;
		}
	});
})( jQuery );