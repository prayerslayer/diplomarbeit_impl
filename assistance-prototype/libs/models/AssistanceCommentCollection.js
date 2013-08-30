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

		// see http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
		linkify: function( text ) {  
            return text.replace( /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1">$1</a>' );
        },

		parse: function( data ) {

			var that = this;

			data.sort( function( c1, c2 ) {
				return c1.versions[0].timestamp < c2.versions[0].timestamp;
			});

			_.each( data, function( c ) {
				var models = [];
				// user stuff
				c.id = c.comment_id;
				c.avatar_url = "http://robohash.org/" + c.user_id;
				c.user_name = /* TODO userservice abfragen */ c.user_id;

				// sort versions by date
				c.versions.sort( function( v1, v2 ) {
					return v1.timestamp < v2.timestamp;
				});

				var version = c.versions[ 0 ];
				// make links clickable
				version.text = that.linkify( version.text );
				// create annotations
				_.each( version.annotations, function( anno ) {
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
							} else if ( el.type === "rectangle" ) {
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
				version.annotations = new assistance.AnnotationCollection( models );
			});
			console.debug( "finished parsing comments", data );
			return data;
		}
		
	});
})( jQuery );