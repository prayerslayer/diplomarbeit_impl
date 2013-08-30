/*	Assistance Application
 *	======================
 *
 *	Coordinates and initializes the different views.
 *
 *	@author npiccolotto
 */


var assistance = assistance || {};

( function( $ ) {
	assistance.Application = Backbone.Marionette.Application.extend({

		// find additional component information by its DOM id
		_getComponent: function( comp ) {
			return _.findWhere( this.options.components, {
						"component": comp
					});
		},

		// start the application
		start: function( op ) {
			this.options = op;	// why not keeping an options hash as in every view? ITSA NICE-AH!
			//TODO we would probably listen here for clicks on titlebars?
		},

		// construct a new write comment view
		// component = DOM id
		// responseto = comment that the new comment should respond to (may be null obviously)
		writeComment: function( component, responseto ) {
			var comp = this._getComponent( component ),
				visualization = comp.visualization;

			// create base view
			var writebase = new assistance.BaseView({
				"type": "writecomment",
				"component": component,
				"headline": responseto ? "Write response to " + responseto.get( "user_name" ) : null,	// headline depending on whether this is a response or not
			});
			
			// actual write view
			var writer = new assistance.WriteCommentView({
				"component": component,
				"visualization": visualization,
				"comment_url": this.options.comment_url,
				// this comment data will be transferred to the new comment
				// yes, there are some fields that are not supposed to be in a comment, e.g. the reference to the component
				// however they are ignored on server-side, so that's fine
				"comment_data": {
					"data_annotations_enabled": comp.data_annotations_enabled,
					"dataset_id": this.options.dataset_id,
					"component_id": comp.component_id,
					"user_id": this.options.user_id,
					"visualized_properties": comp.visualized_properties,
					"reference": comp.reference,
					"response_to": responseto ? responseto.get("comment_id" ) : null
				}
			});
			writebase.content.show( writer );
			
			// create the annotation view
			var anno = new assistance.AddAnnotationView({
				"component": component,
				"visualization": visualization	// because the annotation view must know the size
			});
			// register annotation view at writer
			writer.setAnnotationView( anno );
			// create a new annotation region and show annotation view inside.
			// an annotation region is a regular region, except it doesn't delete existing content
			if ( !this[ "region" + component ] ) {
				this[ "region" + component ] = new assistance.AnnotationRegion({
					"el": component,
					"visualization": visualization
				});
			} else {
				this[ "region" + component ].close();	
			}
			this[ "region" + component ].show( anno );
		},


		showHowto: function( component ) {
			//TODO wird sich erst noch zeigen, wie das wirklich aussehen soll.

			var item = new assistance.HowtoItem({
				"component_id": "http://mmt.inf.tu-dresden.de/VizBoard/Something",
				"action": "sort",
				"variable": "player",
				"capability": "cap01",
				"elements": "button",
				"component": "#barchart",
				"visualization": "svg"
			});
			var item2 = new assistance.HowtoItem({
				"component_id": "http://mmt.inf.tu-dresden.de/VizBoard/Something",
				"action": "display",
				"capability": "cap02",
				"elements": "rect:nth-child(odd)",
				"component": "#barchart",
				"visualization": "svg"
			});
			var items = new assistance.HowtoCollection();
			items.add( item );
			items.add( item2 );
			var listbase = new assistance.BaseView({
				"type": "howto",
				"component": "#barchart"
			});
			var list = new assistance.HowtoListView({
				"collection": items,
				"itemView": assistance.HowtoItemView,
				"model": assistance.HowtoItem
			});
			listbase.content.show( list );
		},

		// create a view to read comments
		showComments: function( component ) {
			var compData = this._getComponent( component ),	// get additional info about component
				spinner = new assistance.Spinner({
					"caller": $( component )
				}),
				that = this;
			// construct appropriate url to fetch appropriate comments
			var new_url = this.options.comment_url + "?";
    		new_url += "component=" + encodeURIComponent( compData.component_id );
    		for (var i = compData.visualized_properties.length - 1; i >= 0; i--) {
    			var prop = compData.visualized_properties[i];
    			new_url += "&property=" + encodeURIComponent( prop );
    		};
    		var comments = new assistance.CommentCollection([], {
				"url": new_url
			});
			// load data
			comments.fetch({
				"success": function( collection, response ) {

					var visualization = compData.visualization;
					
					spinner.close();
					collection.each( function( comment ) {
						comment.urlRoot = that.options.comment_url;	// set other url for comments ( model.save() requests go there )
						comment.set( "component", component );			// comments must know component and visualization to display annotations
						comment.set( "visualization", visualization );
					});

					// create actual comment view
					var comment_view = new assistance.ReadCommentsView({
						"collection": comments,
						"component": component,
						"visualization": visualization
					});
					// if someone hits reply, open up write view
					comment_view.on( "reply", function( comment ) {
						that.writeComment( component, comment );
					});
					// create base
					var commentbase = new assistance.BaseView({
						"type": "readcomment",
						"component": component
					});
					commentbase.content.show( comment_view );
				},
				"error": function( col, res) {
					console.error( "could not fetch comment collection", col, res );
				}
			});
		}
	});
})( jQuery );