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
			this.on( "model:showannotations", this.triggerShowAnnotations, this );
			this.on( "model:hideannotations", this.triggerHideAnnotations, this );
		},

		triggerShowAnnotations: function() {
			console.log( "collection trigger show" );
			this.trigger( "showannotations" );
		},

		triggerHideAnnotations: function() {
			this.trigger( "hideannotations" );
		},

		parse: function( data ) {
			_.each( data, function( c ) {
				var models = [];
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
			console.log( data );
			return data;
		}
		
	});
})( jQuery );