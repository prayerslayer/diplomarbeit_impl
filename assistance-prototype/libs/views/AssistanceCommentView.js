var assistance = assistance || {};

( function( $ ) {
	assistance.CommentView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__comment",
		template: "#commentViewTemplate",

		voted: null,

		events: {
			"click [data-action=show-annotations]": "showAnnotations",
			"click [data-action=reply]": "reply",
			"click [data-action=vote-up]": "voteUp",
			"click [data-action=vote-down]": "voteDown"
		},

		initialize: function() {
			_.bindAll(this, "render");
    		this.model.bind( 'change', this.render, this);
    		this.model.bind( 'hide', this.hide, this );
    		this.model.bind( "show", this.show, this );

		},

		show: function() {
			this.$el.fadeIn();
		},

		hide: function() {
			this.$el.fadeOut();
		},

		showAnnotations: function() {
			console.log( "triggered show" );
		},

		reply: function() {
			console.log( "triggered reply" );
		},

		voteUp: function() {
			if ( !this.voted ) {
				// not yet voted
				this.voted = "up";
				this.model.set( "score", this.model.get( "score" ) + 1);
				this.$el.find( ".assistance-comment__comment-metadata-voting_up" ).addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else if ( this.voted === "down" ) {
				// downvoted
				this.voted = "up";
				this.model.set( "score", this.model.get( "score" ) + 2);
				this.$el.find( ".assistance-comment__comment-metadata-voting_up" ).addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.$el.find( ".assistance-comment__comment-metadata-voting_down" ).removeClass( "assistance-comment__comment-metadata-voting_voted" );

			} else if ( this.voted === "up" ) {
				//undo
				this.voted = null;
				this.model.set( "score", this.model.get( "score" ) - 1 );
				this.$el.find( ".assistance-comment__comment-metadata-voting_up" ).removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		},

		voteDown: function() {
			if ( !this.voted ) {
				// not yet voted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 1);
				this.$el.find( ".assistance-comment__comment-metadata-voting_down" ).addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else if ( this.voted === "up" ) {
				// upvoted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 2);
				this.$el.find( ".assistance-comment__comment-metadata-voting_down" ).addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.$el.find( ".assistance-comment__comment-metadata-voting_up" ).removeClass( "assistance-comment__comment-metadata-voting_voted" );
			} else if ( this.voted === "down" ) {
				//undo
				this.voted = null;
				this.model.set( "score", this.model.get( "score" ) + 1 );
				this.$el.find( ".assistance-comment__comment-metadata-voting_down" ).removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		}
		
	});
})( jQuery );