/**
* Some Plugin functions for D3
* @author npiccolotto
*/
(function() {
	/*
	*	Returns a clone of the selection, written by Mike Bostock himself
	*	@see https://groups.google.com/forum/#!topic/d3-js/-EEgqt29wmQ
	*/
	d3.selection.prototype.clone = function clone( ) {
		var node = this.node();
	    return d3.select( node.parentNode.insertBefore( node.cloneNode(true), node.nextSibling));
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
})(); 