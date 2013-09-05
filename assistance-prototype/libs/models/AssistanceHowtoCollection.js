var assistance = assistance || {};

/*
	Howto Collection
========================
	Holds a bunch of HowtoItems, which represent the list items in the instruction view. The collection may be locked and unlocked. If locked, the contained HowtoItems stop reacting to mouseover events.
 
	@author npiccolotto
*/

( function( $ ) {
	assistance.HowtoCollection = Backbone.Collection.extend({
		model: assistance.HowtoItem,

		lock: function() {
			_.each( this.models, function( m ) {
				m.set( "lock", true );
			});
		},

		unlock: function() {
			_.each( this.models, function( m ) {
				m.set( "lock", false );
			});
			this.trigger( "unlocked" );
		},

		initialize: function( models, opts ) {
			this.options = opts;	// why doesn't backbone do this everywhere?
			console.debug( opts );
		},

		_buildXMLEnvelope: function( comp, cap ) {
			var env = '<soapenv:Envelope ' + 
  						'xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" ' + 
  						'xmlns:xsd="http://www.w3.org/2001/XMLSchema" '+
  						'xmlns:q0="http://soap.repository.cruise.inf.tudresden.de">';

  			env += this._buildXMLBody( comp, cap );

  			env += '</soapenv:Envelope>';
  			return env;
		},

		parse: function( data , lol ) {
			console.debug( "parse", data, lol );
		},

		_buildXMLBody: function( comp, cap ) {
			var body = '<soapenv:Body>' + 
							'<q0:getImagesByComponentAndCapability>' + 
	  							'<q0:componentId>' + comp + '</q0:componentId>' + 
	  							'<q0:capabilityId>' + cap + '</q0:capabilityId>' + 
							'</q0:getImagesByComponentAndCapability>' + 
						'</soapenv:Body>';

			return body;
		},

		_buildXML: function( comp, cap ) {
			var xml = '<?xml version="1.0" encoding="UTF-8"?>';
			xml += this._buildXMLEnvelope( comp, cap );
			console.debug( "xml soap", xml );
			return xml;
		},

		// need to override sync as we're not GETting JSON content directly, but POSTing XML first (SOAP).
		sync: function( method, model, opts ) {
			if ( method === "read" ) {
				return $.ajax({
					"url": this.url + "services/CoReService",
					"contentType": "application/soap+xml;charset=UTF-8",
					"data": this._buildXML( this.options.component_id, this.options.capability_id ),
					"dataType": "xml",
					"type": "POST",
					"success": function( data, status ) {
						console.debug( "success fetching howto", data, status );
						return data;
						//TODO now we would need to unpack the SOAP message, parse the json... PROFIT!?
					},
					"error": function( xhr, status ) {
						console.error( "error fetching howto", status );
					}
				});
			}
		}
	});
})( jQuery );