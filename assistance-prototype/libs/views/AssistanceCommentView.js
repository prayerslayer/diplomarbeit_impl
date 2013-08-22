/*
*	Comment View
*	===================
*
*	Does what you would expect...
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentView = Backbone.Marionette.CompositeView.extend({
		tagName: "div",
		className: "assistance-comment__comment",
		template: "#commentViewTemplate",
		model: assistance.Comment,

		annotationsShown: false,

		getItemView: function( item ) {
			if ( item.get( "type" ) === "area" ) {
				return assistance.AreaAnnotationView;
			} else if ( item.get( "type" ) === "point" )
				return assistance.DatapointAnnotationView;
		},

		// do not render annotations inside of this view plz kthxbai
		appendHtml: function( collectionview, itemview, index ) {
			$( collectionview.model.get( "component" ) ).append( itemview.el );
		},

		voted: null,

		ui: {
			"voteup": ".assistance-comment__comment-metadata-voting_up",
			"votedown": ".assistance-comment__comment-metadata-voting_down",
			"score": ".assistance-comment__comment-metadata-score",
			"annos": ".assistance-comment__comment-metadata-show-annos",
			"annosicon": ".assistance-comment__comment-metadata-show-annos_icon",
			"reply": ".assistance-comment__comment-metadata-reply"
		},

		events: {
			"click [data-action=show-annotations]": "showAnnotations",
			"click [data-action=reply]": "reply",
			"click [data-action=vote-up]": "voteUp",
			"click [data-action=vote-down]": "voteDown"
		},

		initialize: function( opts ) {
			// no need to re-render the whole view if just the score changed after voting
			this.collection = opts.model.get( "annotations" );
    		this.model.bind( 'change:score', this.renderScore, this);
    		this.model.bind( 'hide', this.hide, this );
    		this.model.bind( "show", this.show, this );
		},

		// update score
		renderScore: function() {
			this.ui.score.text( this.model.get( "hr_score" ) );
		},

		// show comment
		show: function() {
			this.$el.fadeIn();
		},

		// hide comment - this and show are used by the comment badges, essentially
		hide: function() {
			this.$el.fadeOut();
		},

		showAnnotations: function() {
			var that = this;

			// show/hide annotations
			this.children.call( this.annotationsShown ? "hide" : "show" );
			// update ui
			if ( !this.annotationsShown ) {
				this.ui.annos.text( "Hide annotations" );
				this.ui.annosicon.removeClass( "icon-eye-open" ).addClass( "icon-eye-closed" );
				this.model.trigger( "showannotations" );
			} else {
				this.ui.annos.text( "Show annotations" );
				this.ui.annosicon.removeClass( "icon-eye-closed" ).addClass( "icon-eye-open" );
				this.model.trigger( "hideannotations" );
			}

			this.annotationsShown = !this.annotationsShown;
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