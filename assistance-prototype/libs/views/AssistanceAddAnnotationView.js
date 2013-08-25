/*
*	Add Annotation View
*	===================
*
*	Handles how a user may annotate the visualization through four tools:
*	selection, text, arrow and rectangle.
*
*	@author npiccolotto
*/
var assistance = assistance || {};

( function( $ ) {
	assistance.AddAnnotationView = Backbone.Marionette.ItemView.extend({
		tagName: "svg",
		className: "assistance-annotations",
		template: "#addannotationViewTemplate",

		capability: "selection",

		ui: {
			"bg": ".assistance-annotations__bg"
		},

		events: {
			"mousemove": "_highlightOnHover",
			"click": "_clickHandler"
		},

		_clear: function() {
			this.capability = "";
			d3.select( this.el ).attr( "class", "assistance-annotations" );
		},

		activateSelection: function() {
			this._clear();
			this.capability = "selection";
			d3.select( this.el ).attr( "class", "assistance-annotations assistance-annotations__selection" );
		},

		// manual hit test. we can't use mousemove or anything like this directly on the elements, because the SVG of this view is above them.
		_getElementAt: function( x, y ) {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first(),
				element = null;
			// loop through each resource in the visualization
			$vis.find( "[resource]" ).each( function( i, res ) {
				// get position and dimensions
				var offset = $( res ).offset(),	
					width = $( res ).width() || parseFloat( $( res ).attr( "width" ) ),
					height = $( res ).height() || parseFloat( $( res ).attr( "height" ) );
				// check if mouse is roughly in between
				if ( ( offset.left < x && x < offset.left + width ) &&
					 ( offset.top < y && y < offset.top + height ) )
					 element = res;
			});
			return element;
		},	

		// get all elements (data points) of the visualization
		_allElements: function() {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first();

			return d3.select( $vis[0] ).selectAll( "[resource]" );
		},

		// handles the highlighting of elements on hover
		_highlightOnHover: function( evt ) {
			// break if selection tool is not active
			if ( this.capability !== "selection" ) 
				return false;
			// manual hit test as this svg is over the actual visualization
			var el = this._getElementAt( evt.pageX, evt.pageY );
			// if we're not over an element, remove class from all unselected ones. this is necessary to properly handle mouseout case.
			if ( !el ) {
				this._allElements().filter( ":not([data-vizboard-selected=true])" ).attr( "class", function( ) {
					return d3.select( this ).attr( "data-vizboard-old-class" ) || d3.select( this ).attr( "class" );
				}).attr( "data-vizboard-old-class", null );
				return false;
			}
			el = d3.select( el );
			// break if this element is already selected
			if ( el.attr( "data-vizboard-selected" ) )
				return false;
			// save class of this element and apply highlight class
			var clazz = el.attr( "class" );
			if ( !el.attr( "data-vizboard-old-class" ) ) {
				el.attr( "data-vizboard-old-class", clazz );
				el.attr( "class", "vizboard-highlight" ); // class="vizboardähighlight <old class>" in mockup not feasible, probably due to specifity of seleciton rules.
			}
		},

		// handles clicks O.O
		_clickHandler: function( evt ) {
			if ( this.capability === "selection" ) {
				// get element if selectino tool is active
				var el = this._getElementAt( evt.pageX, evt.pageY );
				if ( !el )
					return false;
				el = d3.select( el );
				// if it's not selected, select it
				if ( !el.attr( "data-vizboard-selected" ) ) {
					el.attr( "data-vizboard-selected", "true" );
					el.attr( "class", "vizboard-highlight" );
				} else {
					// deselect if already selected
					el.attr( "data-vizboard-selected", null );
					el.attr( "class", el.attr( "data-vizboard-old-class" ) );
					el.attr( "data-vizboard-old-class", null );
				}
				// trigger event with all current selections
				this.trigger( "selection", this._allElements().filter( "[data-vizboard-selected]" ).collect( "resource" ) );
			}
		},

		activateText: function() {
			this._clear();
			this.capability = "text";
			d3.select( this.el ).attr( "class", "assistance-annotations assistance-annotations__text" );
		},

		activateRectangle: function() {
			this._clear();
			this.capability = "rectangle";
			d3.select( this.el ).attr( "class", "assistance-annotations assistance-annotations__rectangle" );
		},

		activateArrow: function() {
			this._clear();
			this.capability = "arrow";
			d3.select( this.el ).attr( "class", "assistance-annotations assistance-annotations__arrow" );
		},

		initialize: function() {
			// see http://stackoverflow.com/questions/9651167/svg-not-rendering-properly-as-a-backbone-view
			this.setElement( document.createElementNS( "http://www.w3.org/2000/svg", this.tagName ) );
			// the line above also destroys the template ;_;
			d3.select( this.el ).attr( "class", "assistance-annotations assistance-annotations__selection" );

			// build a background with mask
			var def = d3.select( this.el ).append( "defs" );
			var mask = def.append( "mask" );
			mask.attr( "id", "annoMask" );
			var maskBg = mask.append( "rect" );
			// see http://stackoverflow.com/questions/11404391/invert-svg-clip-show-only-outside-path?lq=1
			maskBg.style( "fill", "white" );
			maskBg.attr( "width", "100%" );
			maskBg.attr( "height", "100%" );
			var bg = mask.append( "rect" );
			bg.attr( "x", 0 );
			bg.attr( "y", 0 );
			bg.attr( "width", 200 );
			bg.attr( "height", 200 );
			bg.attr( "class", "assistance-annotations__bg")
			bg.style( "fill", "black" );

			var rect = d3.select( this.el ).append( "rect" );
			rect.attr( "x", 0 );
			rect.attr( "y", 0 );
			rect.attr( "width", "100%" );
			rect.attr( "height","100%" );
			rect.style( "opacity", 0.5 );
			rect.style( "fill", "black" );
			rect.attr( "mask", "url(#annoMask)" );

			this.$el = $( this.el );
			this.bindUIElements();
		},

		onShow: function() {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first();
			this.ui.bg.attr( "width", $vis.width() );
			this.ui.bg.attr( "height", $vis.height() );
			this.ui.bg.attr( "y", $vis[0].offsetTop );
			this.ui.bg.attr( "x", $vis[0].offsetLeft );
		}

	});
})( jQuery );