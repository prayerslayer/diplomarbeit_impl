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
		offsetLeft: 0,
		offsetTop: 0,

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
				var offset = $( res ).offset();
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
				return; // if we would return false here, the drag behavior would not work
			// manual hit test as this svg is over the actual visualization
			var el = this._getElementAt( evt.pageX, evt.pageY );
			// if we're not over an element, remove class from all unselected ones. this is necessary to properly handle mouseout case.
			if ( !el ) {
				this._allElements().filter( ":not([data-vizboard-selected=true])" ).attr( "class", function( ) {
					return d3.select( this ).attr( "data-vizboard-old-class" ) || d3.select( this ).attr( "class" );
				}).attr( "data-vizboard-old-class", null );
				return;
			}
			el = d3.select( el );
			// break if this element is already selected
			if ( el.attr( "data-vizboard-selected" ) )
				return;
			// save class of this element and apply highlight class
			var clazz = el.attr( "class" );
			if ( !el.attr( "data-vizboard-old-class" ) ) {
				el.attr( "data-vizboard-old-class", clazz );
				el.attr( "class", "vizboard-highlight" ); // class="vizboard-highlight <old class>" in mockup not feasible, probably due to specifity of seleciton rules.
			}
		},

		// triggers text event
		_triggerText: function() {
			var texts = [];
			d3.select( this.el ).selectAll( "text.assistance-annotations__text_content" ).each( function() {
				var text = {}; // x, y, text
				text.x = d3.select( this ).attr( "data-vizboard-textinfo-x" ) * 100;
				text.y = d3.select( this ).attr( "data-vizboard-textinfo-y" ) * 100;
				text.text = d3.select( this ).text();
				texts.push( text );
			});
			this.trigger( "text", texts );
		},

		// triggers selection event
		_triggerSelection: function() {
			this.trigger( "selection", this._allElements().filter( "[data-vizboard-selected]" ).collect( "resource" ) );
		},

		// triggers rectangle event
		_triggerRectangle: function() {
			var rects = [],
				that = this;
			d3.select( this.el ).selectAll( "rect.assistance-annotations__rectangle_finished" ).each( function() {
				// go through rects and collect x1,y1,x2,y2
				var self = d3.select( this ),
					rect = {},
					q = parseInt( self.attr( "data-vizboard-quadrant" ) ),
					x = parseFloat( self.attr( "x" ) ) - that.offsetLeft,
					y = parseFloat( self.attr( "y" ) ) - that.offsetTop,
					w = parseFloat( self.attr( "width" ) ),
					h = parseFloat( self.attr( "height" ) );

				// keeping coordinates absolute, because later they may be fed to component API
				if ( q === 4 ) {
					// normal
					rect.x1 = x;
					rect.y1 = y;
					rect.x2 = x + w;
					rect.y2 = y + h;
				} else if ( q === 3 ) {
					// rotated 180°, translated by negative height
					// top left corner is now top right
					// bottom right corner is bottom left
					rect.x1 = x - w;
					rect.y1 = y;
					rect.x2 = x;
					rect.y2 = y + h;
				} else if ( q === 2 ) {
					// inverted, just rotated 180°
					// top left corner is now bottom right
					// bottom right corner is top left
					rect.x1 = x + w;
					rect.y1 = y + h;
					rect.x2 = x;
					rect.y2 = y;
				} else if ( q === 1 ) {
					// rotated 180°, translated by negative width
					// top left = bottom left
					// bottom right = top right
					rect.x1 = x;
					rect.y1 = y - h;
					rect.x2 = x + w;
					rect.y2 = y;
				}
				
				rects.push( rect );
			});
			this.trigger( "rectangle", rects );
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
				this._triggerSelection();

			} else if ( this.capability === "text" ) {
				if ( evt.target.tagName !== "text" ) {
					var text = d3.select( this.el ).append( "text" );
					text.attr( "class", "assistance-annotations__text_content")
					text.attr( "x", evt.offsetX );
					text.attr( "y", evt.offsetY );
					var t = prompt( "Please enter text:" );
					if ( t ) {
						text.text( t );
						text.attr( "data-vizboard-textinfo-x", ( evt.offsetX -this.offsetLeft ) / this.$el.width() );
						text.attr( "data-vizboard-textinfo-y", ( evt.offsetY - this.offsetTop ) / this.$el.height() );
						$( text.node() ).focus( );	
						this._triggerText();
					} else
						text.remove(); 
					
				} else {
					// edit text
					var text = d3.select( evt.target ),
						t = text.text(),
						newText = prompt( "Please enter new text:", t );

					if ( newText ) {
						text.text( newText );
					}
					this._triggerText();
				}
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
			bg.attr( "class", "assistance-annotations__bg")
			bg.style( "fill", "black" );

			var rect = d3.select( this.el ).append( "rect" );
			rect.attr( "x", 0 );
			rect.attr( "y", 0 );
			rect.attr( "width", "100%" );
			rect.attr( "height","100%" );
			rect.style( "opacity", 0.5 );
			rect.style( "fill", "black" );
			rect.attr( "mask", "url(#annoMask)" ); //TODO static url problematic if there are multiple views of this opened

			this.$el = $( this.el );
			this.bindUIElements();
		},

		_dragStartHandler: function( ) {
			if ( this.capability === "rectangle" ) {
				var rect = d3.select( this.el ).append( "rect" );
				rect.attr( "class", "assistance-annotations__rectangle_current" );

				rect.attr( "x", d3.event.sourceEvent.offsetX );
				rect.attr( "y", d3.event.sourceEvent.offsetY );
			}
		},

		_dragHandler: function( ) {
			if ( this.capability === "rectangle" ) {
				var rect = d3.select( this.el ).select( "rect.assistance-annotations__rectangle_current" ),
					width = d3.event.x - rect.attr( "x" ),
					height= d3.event.y - rect.attr( "y" );
				
				if ( width > 0 && height > 0 ) {
					rect.attr( "width",  width );
					rect.attr( "height",  height );
					rect.attr( "transform", null );
					rect.attr( "data-vizboard-quadrant", 4 );
				} else {
					rect.attr( "width", Math.abs( width) );
					rect.attr( "height", Math.abs( height ) );
					var t = null,
						x = parseFloat(rect.attr("x") ),
						y = parseFloat(rect.attr("y") ),
						w = parseFloat(rect.attr("width") ),
						h = parseFloat(rect.attr("height") ),
						q = 4;	// in which quadrant from starting point is the rect actually located?

					// transform if necessary
					if ( width < 0 && height < 0 ) {
						t = "rotate(180, " + x + "," + y + ")" ;
						q = 2;
					}
					else if ( width < 0 ) {
						t = "rotate(180," + x + "," + y + ")translate(0,-" + height + ")";
						q = 3;
					}
					else if ( height < 0 ) {
						t = "rotate(180," + x + "," + y + ")translate(-" + width + ")";
						q = 1;
					}

					rect.attr( "data-vizboard-quadrant", q );
					rect.attr( "transform", t );
				}
			}
		},

		_dragEndHandler: function() {
			if ( this.capability === "rectangle" ) {
				var rect = d3.select( this.el ).select( "rect.assistance-annotations__rectangle_current" );
				
				rect.attr( "class", "assistance-annotations__rectangle_finished" );
				this._triggerRectangle();
			}
		},

		onShow: function() {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first(),
				that = this;
			
			this.offsetLeft = $vis[0].offsetLeft;
			this.offsetTop = $vis[0].offsetTop;
			this.width = $vis.width();
			this.height = $vis.height();

			this.ui.bg.attr( "width", this.width );
			this.ui.bg.attr( "height", this.height );
			this.ui.bg.attr( "x", this.offsetLeft );
			this.ui.bg.attr( "y", this.offsetTop );

			var dragBehavior = d3.behavior.drag()
						.on( "dragstart", this._dragStartHandler.bind( this ) )
						.on( "drag", this._dragHandler.bind( this ) )
						.on( "dragend", this._dragEndHandler.bind( this ));

			d3.select( this.el )
				.call( dragBehavior );
		}

	});
})( jQuery );