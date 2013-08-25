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
			"annos": ".assistance-comment__write-comment-anno-select, .assistance-comment__write-comment-anno-arrow, .assistance-comment__write-comment-anno-rect, .assistance-comment__write-comment-anno-text",
			"annoSelect": ".assistance-comment__write-comment-anno-select",
			"annoArrow": ".assistance-comment__write-comment-anno-arrow",
			"annoRect": ".assistance-comment__write-comment-anno-rect",
			"annoText": ".assistance-comment__write-comment-anno-text",
			"textArea": ".assistance-comment__write-comment-area",
			"submit": ".assistance-base__submit"
		},

		events: {
			"click [data-action=select-text]": "_selectText",
			"click [data-action=select-rect]": "_selectRect",
			"click [data-action=select-select]": "_selectSelect",
			"click [data-action=select-arrow]": "_selectArrow",
			"click [data-action=submit]": "_submit"
		},

		initialize: function( opt ) {
			this.bindUIElements();
		},

		setAnnotationView: function( view ) {
			this.annotationView = view;
			this.annotationView.on( "selection", this._processSelection, this );
			this.annotationView.on( "text", this._processText, this );
			this.annotationView.on( "arrow", this._processArrow, this );
			this.annotationView.on( "rectangle", this._processRectangle, this );
		},

		_processRectangle: function( rect ) {

		},

		_processArrow: function( arrow ) {

		},

		_processText: function( text ) {
			console.log( text );
		},

		_processSelection: function( selection ) {
			console.log( selection );
		},

		_submit: function() {
			console.log( this.regions);
		},

		_selectText: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoText.addClass( "assistance-comment__write-comment-anno_selected" );
			this.annotationView.activateText();
		},

		_selectRect: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoRect.addClass( "assistance-comment__write-comment-anno_selected" );
			this.annotationView.activateRectangle();
		},

		_selectSelect: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoSelect.addClass( "assistance-comment__write-comment-anno_selected" );
			this.annotationView.activateSelection();
		},

		_selectArrow: function() {
			this.ui.annos.removeClass( "assistance-comment__write-comment-anno_selected" );
			this.ui.annoArrow.addClass( "assistance-comment__write-comment-anno_selected" );
			this.annotationView.activateArrow();
		}

	});
})( jQuery );