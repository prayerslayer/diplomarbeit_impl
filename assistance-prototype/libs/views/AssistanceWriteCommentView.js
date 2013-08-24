/*
*	Write Comments View
*	===================
*
*
*
*	@author npiccolotto
*/


var assistance = assistance || {};

( function( $ ) {
	assistance.WriteCommentView = Backbone.Marionette.Layout.extend({
		tagName: "div",
		className: "assistance-comment__write-comment",
		template: "#writecommentViewTemplate",

		ui: {
			"annos":   ".assistance-comment__write-comment-anno-select, .assistance-comment__write-comment-anno-arrow, .assistance-comment__write-comment-anno-rect, .assistance-comment__write-comment-anno-text",
			"annoSelect": ".assistance-comment__write-comment-anno-select",
			"annoArrow": ".assistance-comment__write-comment-anno-arrow",
			"annoRect": ".assistance-comment__write-comment-anno-rect",
			"annoText": ".assistance-comment__write-comment-anno-text",
			"textArea": ".assistance-comment__write-comment-area",
			"submit": ".assistance-base__submit"
		},

		events: {
			"click [data-action=select-text]": "selectText",
			"click [data-action=select-rect]": "selectRect",
			"click [data-action=select-select]": "selectSelect",
			"click [data-action=select-arrow]": "selectArrow",
			"click [data-action=submit]": "submit"
		},

		initialize: function( opt ) {
			this.regions.annotations = opt.component + " " + opt.visualization;
			this.bindUIElements();
		},

		submit: function() {
			console.log( this.regions);
		},

		selectText: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoText.addClass( "assistance-comment__write-comment-anno_selected" );
		},

		selectRect: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoRect.addClass( "assistance-comment__write-comment-anno_selected" );
		},

		selectSelect: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoSelect.addClass( "assistance-comment__write-comment-anno_selected" );
		},

		selectArrow: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoArrow.addClass( "assistance-comment__write-comment-anno_selected" );
		}

	});
})( jQuery );