/*
*	Write Comments View
*	===================
*
*	The view where a user writes his comment and chooses annotation tools.
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

		// checks whether the content of the text area is something different than the placeholder
		// enables submit button, if true
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

		// reset annotations
		// important because annotations would be preserved for subsequent comments
		resetAnnotations: function() {
			this.annotations = {
				"selections": [],
				"arrows": [],
				"rectangles": [],
				"text": []
			};
		},

		// sets the annotation view for this write comment view
		setAnnotationView: function( view ) {
			this.annotationView = view;
			this.annotationView.on( "selection", this._processSelection, this );
			this.annotationView.on( "text", this._processText, this );
			this.annotationView.on( "arrow", this._processArrow, this );
			this.annotationView.on( "rectangle", this._processRectangle, this );
		},

		// process functions: just save the object into annotations
		// annotation view publishes always ALL the annotations
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

		// submit a new comment
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
			var comment = _.clone( this.options.comment_data );	// i don't know, a clone just looked right. defensive programming!
			comment.score = 0;

			// memento
			var filled_in_memento = {};
			_.each( comment.memento, function( prop ) {
				filled_in_memento[ prop ] = comment.reference.getProperty( prop );
			});
			delete comment.memento;
			comment.memento = filled_in_memento;

			//versions 
			var versions = [],
				version = {
					"number": 1,
					"text": this.ui.textArea.html().trim(), // preserve paragraphs with html content
					"timestamp": Date.now(),
					"annotations": []	// these are set later
				};

			
			var area_annotations = {
				"type": "area",
				"visualization_width": this.annotationView.width,
				"visualization_height": this.annotationView.height,
				"elements": []
			};

			var datapoint_annotations = [];
			var data_annotations = [];
			// check whether a visualized property is nominal 
			var has_nominal = _.contains( _.pluck( comment.visualized_properties, "type" ), "nominal" );
			
			// check rectangles
			// must not contain nominal values as it doesn't make sense to define start and end points. from sweden to finland? from ferrari to audi?
			if ( this.annotations.rectangles && comment.data_annotations_enabled && !has_nominal) {

				_.each( this.annotations.rectangles, function( rect ) {

					// rect has absolute values
					var values = comment.reference.coordinatesToData( rect.top, rect.left, rect.top + rect.height, rect.left + rect.width );

					/* now values must look something like [{
						"from": 2012,
						"to": 2015,
						"uri": xsd:date					
					}, {
						"from": 40,
						"to": 505,
						"uri": appleSharePrice
					}]
					*/

					//TODO hier sind invalid dates drin - mal überprüfen ob die richtigen koordinaten eingegeben werden. (wahrscheinlich nicht, weil die von der bounding box relativ zur komponente sind, ich aber die tatsächlichen x/y werte auf der timeline haben will, also auch ein offsetLeft von 4000 px ).
					data_annotations.push( {
						"type": "data",
						"items": values
					});
				});
			} else if ( this.annotations.rectangles ) {
				// rect annotations
				_.each( this.annotations.rectangles, function( rect ) {
					var scaled = that.annotationView.scale( rect );	// coordinates are relative, this makes visualization_width/_height useless...
					scaled.type = "rectangle";
					area_annotations.elements.push( scaled );
				});
			}

			// check if text annotations are present
			if ( this.annotations.text ) {
				_.each( this.annotations.text, function( t ) {
					var scaled = that.annotationView.scale( t );
					scaled.type = "text";
					area_annotations.elements.push( scaled );
				});
			}

			// check if arrow annotations are present
			if ( this.annotations.arrows ) {
				_.each( this.annotations.arrows, function( a ) {
					var scaled = that.annotationView.scale( a );
					scaled.type = "arrow";
					area_annotations.elements.push( scaled );
				});
			}

			// check if the user made any selections
			if ( this.annotations.selections ) {
				// explicit datapoint annotations
				_.each( this.annotations.selections, function( s ) {
					var point = {};
					point.uri = s;
					point.type = "point";
					point.values = comment.reference.getDataFromResource( s );
					datapoint_annotations.push( point );
				});
			}

			// add these annotations if there are any
			if ( area_annotations.elements.length )
				version.annotations.push( area_annotations );
			if ( datapoint_annotations.length )
				version.annotations.push.apply( version.annotations, datapoint_annotations );
			if ( data_annotations.length ) {
				version.annotations.push.apply( version.annotations, data_annotations );
			}

			versions.push( version );
			comment.versions = versions;
			delete comment.reference; // causes circular structure and JSON.stringify fail
			console.debug( comment );
			// submit
			// alternative: create a new CommentModel( comment ) and call .save() on it. does the same under the hood.
			$.ajax({
				type: "POST",
				url: that.options.comment_url,
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify( comment )
			}).fail( function( xhr, status, error ) {
				smoke.alert( "Failed to save comment: " + error );
				console.error( "failed to save comment", xhr, status, error );
			}).done( function( data, status, xhr ) {
				// notification
				smoke.alert( "Comment created." );
				// get new comment (inkl id!)
				var newCmt = new assistance.Comment( data );
				// handle it at the application level
				that.trigger( "newcomment", newCmt );
			}).always( function( dataxhr, status, errorxhr ) {
				// delete annotations
				that.resetAnnotations();
			});

			// close things
			spinner.close();
			this.close();
				
		},

		// close annotation view too!
		onBeforeClose: function() {
			this.annotationView.close();
			this.resetAnnotations();
		},

		// activation functions

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