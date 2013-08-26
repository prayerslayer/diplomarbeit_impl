/*
	Comment Collection
	====================	
 	
 	Fetches comments from backend and holds them together.

	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.CommentCollection = Backbone.Collection.extend({
			
		model: assistance.Comment,

		initialize: function( options ) {
			
		},

		parse: function( data ) {
			_.each( data, function( c ) {
				var models = [];
				c.text = _.escape( c.text ),
				_.each( c.annotations, function( anno ) {
					var model = null;
					if ( anno.type === "area" ) {
						model = new assistance.AreaAnnotation({
							"type": "area",
							"visualization_width": anno.visualization_width,
							"visualization_height": anno.visualization_height
						});
						_.each( anno.elements, function( el ) {
							if ( el.type === "text" ) {
								model.get( "elements" ).add( new assistance.TextAnnotation( el ) );
							} else if ( el.type === "arrow" ) {
								model.get( "elements" ).add( new assistance.ArrowAnnotation( el ) );
							} else if ( el.type === "rect" ) {
								model.get( "elements" ).add( new assistance.RectangleAnnotation( el ) );
							}
						});
					} else if ( anno.type === "point" ) {
						model = new assistance.DatapointAnnotation( anno );
					} else if ( anno.type === "group" ) {

					} else if ( anno.type === "data" ) {
						
					}
					models.push( model );
				});
				c.annotations = new assistance.AnnotationCollection( models );
			});
			console.debug( "finished parsing comments", data );
			return data;
		}
		
	});
})( jQuery );