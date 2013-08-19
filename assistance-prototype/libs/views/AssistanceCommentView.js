var assistance = assistance || {};

( function( $ ) {
	assistance.CommentView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__comment",
		template: "#commentViewTemplate",

		voted: null,

		ui: {
			"voteup": ".assistance-comment__comment-metadata-voting_up",
			"votedown": ".assistance-comment__comment-metadata-voting_down",
			"score": ".assistance-comment__comment-metadata-score"
		},

		events: {
			"click [data-action=show-annotations]": "showAnnotations",
			"click [data-action=reply]": "reply",
			"click [data-action=vote-up]": "voteUp",
			"click [data-action=vote-down]": "voteDown"
		},

		initialize: function() {
			// no need to re-render the whole view if just the score changed after voting
    		this.model.bind( 'change:score', this.renderScore, this);
    		this.model.bind( 'hide', this.hide, this );
    		this.model.bind( "show", this.show, this );

		},

		renderScore: function() {
			this.ui.score.text( this.model.get( "score" ) );
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
				this.ui.voteup.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else if ( this.voted === "down" ) {
				// downvoted
				this.voted = "up";
				this.model.set( "score", this.model.get( "score" ) + 2);
				this.ui.voteup.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.votedown.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				
			} else if ( this.voted === "up" ) {
				//undo
				this.voted = null;
				this.model.set( "score", this.model.get( "score" ) - 1 );
				this.ui.voteup.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		},

		voteDown: function() {
			if ( !this.voted ) {
				// not yet voted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 1);
				this.ui.votedown.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else if ( this.voted === "up" ) {
				// upvoted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 2);
				this.ui.votedown.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.voteup.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				
			} else if ( this.voted === "down" ) {
				//undo
				this.voted = null;
				this.model.set( "score", this.model.get( "score" ) + 1 );
				this.ui.votedown.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		}
		
	});
})( jQuery );