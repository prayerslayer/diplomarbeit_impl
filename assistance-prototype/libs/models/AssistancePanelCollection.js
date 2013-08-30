/*
*	Panel Collection
*	===================
*
*	This collection fetches image data from the CoRe backend and constructs a 
*	bunch of panel models.
*
*	@author npiccolotto
*/

var assistance = assistance || {};

( function( $ ) {
	assistance.PanelCollection = Backbone.Collection.extend({
		model: assistance.Panel,

		initialize: function( opts ) {
			
		},

		parse: function( data, response ) {
			//TODO in echt ist alles kein JSON sondern SOAP/XML mit JSON content
			var that = this;
			var collection = [];
			_.each( data.operations, function( op, i ) {
				var element_panel = {
					"type": "operation",
					"image_url": op.url,
					"animate": true,
					"is_subsequent": i > 0,
					"source_bbox": [ 0, 0, 100, 100 ],
					"target_bbox": op.bbox
				};
				collection.push( element_panel );
				var caption_panel = {
					"type": "caption",
					"image_url": op.url,
					"source_bbox": op.bbox,
					"is_subsequent": i > 0,
					"animate": false,
					"operation": op.operation
				}
				collection.push( caption_panel );
			})

			var m_result = {
				"image_url": data.result,
				"type": "result",
				"animate": true,
				"task": this.task,
				"target_bbox": [ 0, 0, 100, 100 ]
			};
			collection.push( m_result );

			var len = collection.length;
			collection[ len - 1 ].source_bbox = collection[ len - 3 ].target_bbox;

			return collection;
		}
	});
})( jQuery );