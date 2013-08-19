var assistance = assistance || {};

( function( $ ) {
	assistance.PanelCollection = Backbone.Collection.extend({
		model: assistance.Panel,

		parse: function( data, response ) {
			var that = this;
			var collection = [];
			var m_initial = {
				"image_url": data.initial,
				"type": "initial",
				"source_bbox": [ 0, 0, 100, 100 ],
				"target_bbox": data.operations[0].bbox
			};
			collection.push( m_initial );

			_.each( data.operations, function( op ) {
				var model = {
						"type": "operation",
						"image_url": op.url,
						"target_bbox": op.bbox,
						"operation": op.operation
					};
				collection.push( model );
			})

			var m_result = {
				"image_url": data.result,
				"type": "result",
				"target_bbox": [ 0, 0, 100, 100 ]
			};
			collection.push( m_result );

			for (var i = collection.length - 1; i >= 1; i--) {
				var m = collection[ i ],
					n = collection[ i - 1 ];
				m.source_bbox = n.target_bbox;
			}
			return collection;
		}
	});
})( jQuery );