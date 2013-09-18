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

		// wraps links with link tags (<a>)
		// see http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
		_linkify: function( text ) {  
            return text.replace( /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank">$1</a>' );
        },

        // keep comments sorted by date
        comparator: function( v1, v2 ) {
        	if ( v1.get("latest").timestamp > v2.get("latest").timestamp )
        		return -1;
        	if ( v1.get("latest").timestamp < v2.get("latest").timestamp )
        		return 1;
        	return 0;
        },

        initialize: function( size, opts ) {
        	this.options = opts;
        },

        // parses a response from the backend
		parse: function( data ) {

			var that = this;
			
			// now we have to create a lot of models
			_.each( data, function( c ) {
				var models = [];
				// user stuff
				c.id = c.comment_id;
				c.avatar_url = "http://robohash.org/" + c.user_id;	// yep, we could get it from the user service as well
				c.user_name = /* TODO call user service */ c.user_id;

				c.current_user = that.options.current_user;
				c.urlRoot = that.options.comment_url;
				c.component = that.options.component;
				c.visualization = that.options.visualization;
				c.reference = that.options.reference;
				
				var version = c.versions[ 0 ];	// this is the version we're going to display
				// make links clickable
				version.text = that._linkify( version.text );
				// create annotation models
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
						//TODO WONTFIX groups are just a collection of points.
					} else if ( anno.type === "data" ) {
						model = new assistance.DataAnnotation( anno );
						model.set( "reference", c.reference ); // data anno needs to access component api
						model.set( "component", c.component );
						model.set( "visualization", c.visualization );
						models.push( model );
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