/**
* Some Plugin functions for D3
* @author npiccolotto
*/
(function() {
	/*
	*	Returns a clone of the selection, written by Mike Bostock himself
	*	@see https://groups.google.com/forum/#!topic/d3-js/-EEgqt29wmQ
	*/
	d3.selection.prototype.clone = function clone( deep ) {
		var node = this.node();
	    return d3.select( node.parentNode.insertBefore( node.cloneNode( deep != null ? deep : true ), node.nextSibling));
	};

	/*
	* 	Appends an existing DOM element. append() and insert() only create elements.
	*	@see https://groups.google.com/forum/#!topic/d3-js/AsbOTQskipU
	*/
	d3.selection.prototype.appendChild = function appendChild( element ) {
		return this.select( function() {
			return this.appendChild( element.node() );
		});
	};

	/* 
	*	Collects an attribute of a selection, possibly multiple elements.
	*/
	d3.selection.prototype.collect = function collect( attr ) {
		if ( !attr )
			return [];
		var attrs = [];
		this.each( function() {
			attrs.push( d3.select( this ).attr( attr ) );
		});
		return attrs;
	};
})(); 