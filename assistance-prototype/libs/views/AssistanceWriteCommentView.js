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
	assistance.WriteCommentView = Backbone.Marionette.ItemView.extend({
		tagName: "div",
		className: "assistance-comment__write-comment",
		template: "#writecommentViewTemplate",

		ui: {
			"annos": ".assistance-comment__write-comment-anno-select, .assistance-comment__write-comment-anno-arrow, .assistance-comment__write-comment-anno-rect, .assistance-comment__write-comment-anno-text",
			"annoSelect": ".assistance-comment__write-comment-anno-select",
			"annoArrow": ".assistance-comment__write-comment-anno-arrow",
			"annoRect": ".assistance-comment__write-comment-anno-rect",
			"annoText": ".assistance-comment__write-comment-anno-text",
			"textArea": ".assistance-comment__write-comment-area"
		},

		events: {
			"click [data-action=select-text]": "selectText",
			"click [data-action=select-rect]": "selectRect",
			"click [data-action=select-select]": "selectSelect",
			"click [data-action=select-arrow]": "selectArrow"
		},

		// http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element
		selectElementContents: function( $el ) {
		    var range = document.createRange();
		    range.selectNodeContents($el[0]);
		    var sel = window.getSelection();
		    sel.removeAllRanges();
		    sel.addRange(range);
		},

		onShow: function() {
			this.selectElementContents( this.ui.textArea );
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