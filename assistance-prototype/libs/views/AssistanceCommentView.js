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
		previousState: null,


		getItemView: function( item ) {
			if ( item.get( "type" ) === "area" ) {
				return assistance.AreaAnnotationView;
			} else if ( item.get( "type" ) === "point" )
				return assistance.DatapointAnnotationView;
		},

		// do not render annotations inside of this view plz kthxbai
		appendHtml: function( collectionview, itemview, index ) {
			var $comp = $( collectionview.model.get( "component" ) );
			$comp.append( itemview.el );
		},

		votes_enabled: true,	// false if this is own comment
		annos_enabled: false,	// true if there are annotations
		voted: null,

		ui: {
			"votes": ".assistance-comment__comment-metadata-voting",
			"voteup": ".assistance-comment__comment-metadata-voting_up",
			"votedown": ".assistance-comment__comment-metadata-voting_down",
			"score": ".assistance-comment__comment-metadata-score",
			"annos": ".assistance-comment__comment-metadata-show-annos",
			"annostext": ".assistance-comment__comment-metadata-show-annos_text",
			"annosicon": ".assistance-comment__comment-metadata-show-annos_icon",
			"reply": ".assistance-comment__comment-metadata-reply",
		},

		events: {
			"click [data-action=show-annotations]": "_toggleAnnotations",
			"click [data-action=reply]": "_reply",
			"click [data-action=vote-up]": "_voteUp",
			"click [data-action=vote-down]": "_voteDown",
			"click [data-action=view-response]": "_viewResponse"
		},

		initialize: function( opts ) {
			this.collection = opts.model.get( "latest" ).annotations;
			// disable show annotations button if there aren't any
			if ( this.collection.length ) {
				this.annos_enabled = true;
			}
			// disable voting if this is own comment
			if ( this.model.get( "user_id" ) === this.model.get( "current_user" ) ) {
				this.votes_enabled = false;
			}
    		this.model.bind( 'change:score', this._renderScore, this);
		},

		onRender: function() {
			if ( !this.annos_enabled ) {
				this.ui.annos
						.removeClass( "assistance-comment__comment-metadata-show-annos")
						.addClass( "assistance-comment__comment-metadata-show-annos_disabled" );
			}
			if ( !this.votes_enabled ) {
				this.ui.votes
						.removeClass( "assistance-comment__comment-metadata-voting" )
						.addClass( "assistance-comment__comment-metadata-voting_disabled" );
			}
			if ( this.model.get( "voted" ) > 0 ) {
				this._toggleVoteUpUI( true );
				this.voted = "up";
			} else if ( this.model.get( "voted" ) < 0 ) {
				this._toggleVoteDownUI( true );
				this.voted = "down";
			}
		},

		// update score
		_renderScore: function() {
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
		_viewResponse: function() {
			this.trigger( "viewresponse", this.model.get( "response_to" ) );
		},

		_unloadMemento: function() {
			// reset previous state of component
			var that = this,
				memo = this.model.get( "memento" ),
				comp = this.model.get( "reference" );

			_.each( this.previousState, function( value, prop ) {
				comp.setProperty( prop, value );
			});
		},

		_loadMemento: function() {
			// save current state
			var that = this,
				memo = this.model.get( "memento" ),
				comp = this.model.get( "reference" );
			this.previousState = {};
			_.each( memo, function( value, prop ) {
				that.previousState[ prop ] = comp.getProperty( prop );
			});
			// load memento
			_.each( memo, function( value, prop ) {
				comp.setProperty( prop, value );
			});
		},

		hideAnnotations: function() {
			this._unloadMemento();
			this.ui.annostext.text( "Show annotations" );
			this.children.call( "hide" );
			this.ui.annosicon.removeClass( "icon-eye-close" ).addClass( "icon-eye-open" );
		},

		showAnnotations: function() {
			if ( !this.annos_enabled )
				return;

			this._loadMemento();
			this.ui.annostext.text( "Hide annotations" );
			this.children.call( "show" );
			this.ui.annosicon.removeClass( "icon-eye-open" ).addClass( "icon-eye-close" );
		},

		_toggleAnnotations: function() {
			if ( !this.annos_enabled ) 
				return;
			// UI will get updated from parent
			this.trigger( !this.annotationsShown ? "showannotations" : "hideannotations", this.cid );
			this.annotationsShown = !this.annotationsShown;
		},

		_reply: function() {
			this.trigger( "reply", this.model );
		},

		_voteUp: function( ) {
			if ( !this.votes_enabled )
				return;

			var amount = 0,
				old_score = this.model.get( "score" ),
				old_voted = this.voted,
				that = this;
			if ( !this.voted ) {
				// not yet voted
				this.voted = "up";
				this.model.set( "score", old_score + 1);
				this._toggleVoteUpUI( true );
				amount = 1;
			} else if ( this.voted === "down" ) {
				// downvoted
				this.voted = "up";
				this.model.set( "score", old_score + 2);
				this._toggleVoteUpUI( true );
				amount = 1;
			} else if ( this.voted === "up" ) {
				//undo
				this.voted = null;
				this.model.set( "score", old_score - 1 );
				this._toggleVoteUpUI( false );
			}
			this.model.vote( amount );
		},

		_toggleVoteDownUI: function( enable ) {
			if ( enable ) {
				this.ui.votedown.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else {
				this.ui.votedown.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		},

		_toggleVoteUpUI: function( enable ) {
			if ( enable ) {
				this.ui.voteup.addClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.addClass( "assistance-comment__comment-metadata-voting_voted" );
			} else {
				this.ui.voteup.removeClass( "assistance-comment__comment-metadata-voting_voted" );
				this.ui.score.removeClass( "assistance-comment__comment-metadata-voting_voted" );
			}
		},

		_voteDown: function( ) {
			if ( !this.votes_enabled )
				return;

			var amount = 0;
			if ( !this.voted ) {
				// not yet voted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 1);
				this._toggleVoteDownUI( true );
				amount = -1;
			} else if ( this.voted === "up" ) {
				// upvoted
				this.voted = "down";
				this.model.set( "score", this.model.get( "score" ) - 2);
				this._toggleVoteDownUI( true );
				amount = -1;
			} else if ( this.voted === "down" ) {
				//undo
				this.voted = null;
				this.model.set( "score", this.model.get( "score" ) + 1 );
				this._toggleVoteDownUI( false );
			}
			this.model.vote( amount );
		}
		
	});
})( jQuery );