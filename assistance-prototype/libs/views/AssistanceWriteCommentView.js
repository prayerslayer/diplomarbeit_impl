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

		annotations: {
			"selections": [],
			"arrows": [],
			"rectangles": [],
			"text": []
		},
		placeholder: "Put your comment here.",

		ui: {
			"annos": ".assistance-comment__write-comment-anno-select, .assistance-comment__write-comment-anno-arrow, .assistance-comment__write-comment-anno-rect, .assistance-comment__write-comment-anno-text",
			"annoSelect": ".assistance-comment__write-comment-anno-select",
			"annoArrow": ".assistance-comment__write-comment-anno-arrow",
			"annoRect": ".assistance-comment__write-comment-anno-rect",
			"annoText": ".assistance-comment__write-comment-anno-text",
			"textArea": ".assistance-comment__write-comment-area",
			"submit": ".assistance-comment__submit"
		},

		events: {
			"click [data-action=select-text]": "_selectText",
			"click [data-action=select-rect]": "_selectRect",
			"click [data-action=select-select]": "_selectSelect",
			"click [data-action=select-arrow]": "_selectArrow",
			"click [data-action=submit]": "_submit",
			"input .assistance-comment__write-comment-area": "_input"
		},

		initialize: function( opt ) {
			this.bindUIElements();
		},

		_input: function() {
			var text = this.ui.textArea.text();
			if ( text && text !== this.placeholder ) {
				this.ui.submit.addClass( "assistance-comment__submit_enabled" );
				this.ui.submit.attr( "data-vizboard-enabled", "true" );
			} else {
				this.ui.submit.attr( "data-vizboard-enabled", null );
				this.ui.submit.removeClass( "assistance-comment__submit_enabled" );
			}
		},

		setAnnotationView: function( view ) {
			this.annotationView = view;
			this.annotationView.on( "selection", this._processSelection, this );
			this.annotationView.on( "text", this._processText, this );
			this.annotationView.on( "arrow", this._processArrow, this );
			this.annotationView.on( "rectangle", this._processRectangle, this );
		},

		_processRectangle: function( rect ) {
			this.annotations.rectangles = rect;
		},

		_processArrow: function( arrow ) {
			this.annotations.arrows = arrow;
		},

		_processText: function( text ) {
			this.annotations.text = text;
		},

		_processSelection: function( selection ) {
			this.annotations.selections = selection;
		},

		_submit: function() {
			// check if comment is not empty
			if ( !this.ui.submit.attr( "data-vizboard-enabled" ) )
				return;
			var spinner = new assistance.Spinner({
				"caller": this.ui.submit
			}),
				that = this;

			this.ui.submit.attr( "data-vizboard-enabled", null ); // prevent further clicks
			this.ui.submit.removeClass( "assistance-comment__submit_enabled" ).addClass( "assistance-comment__submit_processing" );

			// init comment
			var comment = _.clone( this.options.comment_data );
			comment.score = 0;
			// memento
			// comment.memento = comment.reference.getMemento();

			//versions 
			var versions = [],
				version = {
					"number": 1,
					"text": this.ui.textArea.html().trim() , // preserve paragraphs
					"timestamp": Date.now(),
					"annotations": []			
				};

			// check if annotations are there
			var area_annotations = {
				"type": "area",
				"visualization_width": this.annotationView.width,
				"visualization_height": this.annotationView.height,
				"elements": []
			};

			var datapoint_annotations = [];
			
			// check rectangles
			if ( this.annotations.rectangles && this.options.dataAnnotationsEnabled ) {
				// data annotations
				//TODO
			} else if ( this.annotations.rectangles ) {
				// rect annotations
				_.each( this.annotations.rectangles, function( rect ) {
					var scaled = that.annotationView.scale( rect );
					scaled.type = "rectangle";
					area_annotations.elements.push( scaled );
				});

			}

			if ( this.annotations.text ) {
				_.each( this.annotations.text, function( t ) {
					var scaled = that.annotationView.scale( t );
					scaled.type = "text";
					area_annotations.elements.push( scaled );
				});
			}

			if ( this.annotations.arrows ) {
				_.each( this.annotations.arrows, function( a ) {
					var scaled = that.annotationView.scale( a );
					scaled.type = "arrow";
					area_annotations.elements.push( scaled );
				});
			}

			if ( this.annotations.selections ) {
				// explicit datapoint annotations
				_.each( this.annotations.selections, function( s ) {
					var point = {};
					point.uri = s;
					point.type = "point";
					// point.values = this.options.reference.getValues( s );
					datapoint_annotations.push( point );
				});

			}

			if ( area_annotations.elements.length )
				version.annotations.push( area_annotations );
			if ( datapoint_annotations.length )
				version.annotations.push.apply( version.annotations, datapoint_annotations );

			versions.push( version );
			comment.versions = versions;

			// submit
			// to be deprecated in favor of Backbone.sync()
			$.ajax({
				type: "POST",
				url: that.options.comment_url,
				dataType: "json",
				data: "comment=" + JSON.stringify( comment )
			}).fail( function( xhr, status, error ) {
				smoke.alert( "Failed to save comment: " + error );
			}).done( function( data, status, xhr ) {
				// notification
				smoke.alert( "Comment created." );
			}).always( function( dataxhr, status, errorxhr ) {
				console.log( dataxhr, status, errorxhr );
			});

			// close things
			spinner.close();
			this.close();
				
		},

		onBeforeClose: function() {
			this.annotationView.close();
			this.annotations = {};
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