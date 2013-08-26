var assistance = assistance || {};

( function( $ ) {
	assistance.Application = Backbone.Marionette.Application.extend({

		_getComponent: function( comp ) {
			return _.findWhere( this.options.components, {
						"component": comp
					});
		},

		start: function( op ) {
			this.options = op;	// why not keeping an options hash as in every view? ITSA NICE-AH!
		},

		writeComment: function( component ) {
			var comp = this._getComponent( component ),
				visualization = comp.visualization;

			// write comment thingy
			var writebase = new assistance.BaseView({
				"type": "writecomment",
				"component": component
			});
			var writer = new assistance.WriteCommentView({
				"component": component,
				"visualization": visualization,
				"comment_url": this.options.comment_url,
				"comment_data": {
					"data_annotations_enabled": comp.data_annotations_enabled,
					"dataset_id": this.options.dataset_id,
					"user_id": this.options.user_id,
					"visualized_properties": comp.visualized_properties,
					"reference": comp.reference
				}
			});
			writebase.content.show( writer );

			// wie annotationen hinzufügen view bauen?
			
			var anno = new assistance.AddAnnotationView({
				"component": component,
				"visualization": visualization
			});
			writer.setAnnotationView( anno );
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

		showComments: function( component ) {
			var comments = new assistance.CommentCollection([], {
				"url": this.options.comment_url
			});
			var spinner = new assistance.Spinner({
					"caller": $( component )
				}),
				that = this;
			// load data
			comments.fetch({
				"success": function( collection, response ) {

					var visualization = that._getComponent( component ).visualization;
					
					spinner.close();

					collection.each( function( comment ) {
						comment.set( "component", component ); //komponente durchreichen
						comment.set( "visualization", visualization );
					});

					var comment_view = new assistance.ReadCommentsView({
						"collection": comments,
						"component": component,
						"visualization": visualization
					});
					var commentbase = new assistance.BaseView({
						"type": "readcomment",
						"component": component
					});
					commentbase.content.show( comment_view );
				},
				"error": function( col, res) {
					console.debug( col, res );
				}
			});
		}
	});
})( jQuery );