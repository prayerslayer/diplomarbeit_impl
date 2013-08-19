var assistance = assistance || {};

( function( $ ) {
	assistance.PanelCollection = Backbone.Collection.extend({
		model: assistance.Panel,

		parse: function( data, response ) {
			var that = this;
			var collection = [];
			_.each( data.operations, function( op ) {
				var element_panel = {
					"type": "operation",
					"image_url": op.url,
					"animate": true,
					"source_bbox": [ 0, 0, 100, 100 ],
					"target_bbox": op.bbox
				};
				collection.push( element_panel );
				var caption_panel = {
					"type": "caption",
					"image_url": op.url,
					"source_bbox": op.bbox,
					"animate": false,
					"operation": op.operation
				}
				collection.push( caption_panel );
			})

			var m_result = {
				"image_url": data.result,
				"type": "result",
				"animate": true,
				"target_bbox": [ 0, 0, 100, 100 ]
			};
			collection.push( m_result );

			var len = collection.length;
			collection[ len - 1 ].source_bbox = collection[ len - 3 ].target_bbox;
			console.debug( collection );
			return collection;
		}
	});
})( jQuery );