/*
*	Comment View
*	===================
*
*	Shows a single comment and its annotations (AnnotationView)
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

		annos_enabled: false,
		voted: null,

		ui: {
			"voteup": ".assistance-comment__comment-metadata-voting_up",
			"votedown": ".assistance-comment__comment-metadata-voting_down",
			"score": ".assistance-comment__comment-metadata-score",
			"annos": ".assistance-comment__comment-metadata-show-annos",
			"annostext": ".assistance-comment__comment-metadata-show-annos_text",
			"annosicon": ".assistance-comment__comment-metadata-show-annos_icon",
			"reply": ".assistance-comment__comment-metadata-reply",
		},

		events: {
			"click [data-action=show-annotations]": "toggleAnnotations",
			"click [data-action=reply]": "reply",
			"click [data-action=vote-up]": "voteUp",
			"click [data-action=vote-down]": "voteDown",
			"click [data-action=view-response]": "viewResponse"
		},

		initialize: function( opts ) {
			this.collection = opts.model.get( "latest" ).annotations;
			if ( this.collection.length ) {
				this.annos_enabled = true;
			}
    		this.model.bind( 'change:score', this.renderScore, this);
		},

		onRender: function() {
			if ( !this.annos_enabled ) {
				this.ui.annos.removeClass( "assistance-comment__comment-metadata-show-annos").addClass( "assistance-comment__comment-metadata-show-annos_disabled" );
			}
		},

		// update score
		renderScore: function() {
			this.ui.score.text( this.model.get( "hr_score" ) );
		},

		// show comment
		show: function() {
			this.$el.fadeIn( 200 );
		},

		// hide comment - this and show are used by the comment badges, essentially
		hide: function() {
			this.$el.fadeOut( 200 );
		},

		// trigger to parent view that it must show this response
		viewResponse: function() {
			this.trigger( "viewresponse", this.model.get( "response_to" ) );
		},

		hideAnnotations: function() {
			this.ui.annostext.text( "Show annotations" );
			this.children.call( "hide" );
			this.ui.annosicon.removeClass( "icon-eye-close" ).addClass( "icon-eye-open" );
		},

		showAnnotations: function() {
			if ( this.annos_enabled ) {
				this.ui.annostext.text( "Hide annotations" );
				this.children.call( "show" );
				this.ui.annosicon.removeClass( "icon-eye-open" ).addClass( "icon-eye-close" );
			}
		},

		toggleAnnotations: function() {
			if ( this.annos_enabled ) {
				// UI will get updated from parent
				this.trigger( !this.annotationsShown ? "showannotations" : "hideannotations", this.cid );
				this.annotationsShown = !this.annotationsShown;
			}
		},

		reply: function() {
			this.trigger( "reply", this.model );
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
			this.model.save();
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
			this.model.save();
		}
		
	});
})( jQuery );