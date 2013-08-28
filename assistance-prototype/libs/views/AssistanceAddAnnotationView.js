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
		width: 0,
		height: 0,

		ui: {
			"bg": ".assistance-annotations__bg"
		},

		events: {
			"mousemove": "_highlightOnHover",
			"click": "_clickHandler",
			"click g > .assistance-annotations__remove, g > .assistance-annotations__remove_line": "_removeHandler"
		},

		_removeHandler: function( evt ) {
			evt.stopPropagation();
			d3.select( evt.target.parentNode )
				.transition()
				.duration( 200 )
				.style( "opacity", 0 )
				.remove();
		},

		_unselect: function() {
			this._allDatapoints()
				.each( this._dehighlightElement )
				.attr( "data-vizboard-selected", null);
		},

		onBeforeClose: function() {
			this._unselect();
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

		// takes absolute values, scales them appropriately to relative ones
		// returns a scaled copy of the original opbject
		scale: function( obj ) {
			var ret = {};
			if ( obj.x )
				ret.x = 100 * obj.x / this.width; // coordinates are already offset
			if ( obj.y )
				ret.y = 100 * obj.y / this.height;
			if ( obj.x1 )
				ret.x1 = 100 * obj.x1 / this.width;
			if ( obj.x2 ) 
				ret.x2 = 100 * obj.x2 / this.width;
			if ( obj.y1 )
				ret.y1 = 100 * obj.y1 / this.height;
			if ( obj.y2 )
				ret.y2 = 100 * obj.y2 / this.height;

			// andre werte übernehmen
			for ( key in obj ) {
				if ( obj.hasOwnProperty( key ) ) {
					if ( !ret.hasOwnProperty( key ) ) {
						ret[ key ] = obj[ key ];
					}
				}
			}

			return ret;
		},

		// manual hit test. we can't use mousemove or anything like this directly on the elements, because the SVG of this view is above them.
		_getElementAt: function( x, y ) {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first(),
				element = null,
				that = this;
			// loop through each resource in the visualization
			$vis.find( "[resource]" ).each( function( i, res ) {
				// get position and dimensions
				var width, height, offsetLeft, offsetTop;

				if ( $( res ).width() ) {
					// jquery works here
					width = $( res ).width();
					height= $( res ).height();
					var offset = $( res ).offset();
					offsetLeft = offset.left;
					offsetTop = offset.top;
				} else {
					// this is a svg visualization, use bbox
					var bbox = res.getBBox();
					var offset = $( that.el ).offset(); 
					width = bbox.width;
					height= bbox.height;
					offsetLeft = offset.left + that.offsetLeft + bbox.x; 
					offsetTop = offset.top + that.offsetTop + bbox.y;
				}

				// check if mouse is roughly in between
				if ( ( offsetLeft < x && x < offsetLeft + width ) &&
					 ( offsetTop < y && y < offsetTop + height ) )
					 element = res;
			});
			return element;
		},	

		// get all elements (data points) of the visualization
		_allDatapoints: function() {
			var $comp = $( this.options.component ).first(),
				$vis = $comp.find( this.options.visualization ).first();

			return d3.select( $vis[0] ).selectAll( "[resource]" );
		},

		_highlightElement: function( ) {
			// save class of this element and apply highlight class
			var el = d3.select( this );
			var clazz = el.attr( "class" );
			if ( !el.attr( "data-vizboard-old-class" ) ) {
				el.attr( "data-vizboard-old-class", clazz );
				el.attr( "class", "vizboard-highlight" ); // class="vizboard-highlight <old class>" in mockup not feasible, probably due to specifity of seleciton rules.
			}
		},

		_dehighlightElement: function(  ) {
			var el = d3.select( this );
			// set old class
			el.attr( "class", el.attr( "data-vizboard-old-class" ) || el.attr( "class" ) );
			// delete copy
			el.attr( "data-vizboard-old-class", null );
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
				this._allDatapoints()
					.filter( ":not([data-vizboard-selected=true])" )
					.each( this._dehighlightElement );
				return;
			}
			el = d3.select( el );
			// break if this element is already selected
			if ( el.attr( "data-vizboard-selected" ) )
				return;
			el.each( this._highlightElement );
		},

		// triggers text event
		_triggerText: function() {
			var texts = [],
				that = this;
			d3.select( this.el ).selectAll( "text.assistance-annotations__text_content" ).each( function() {
				var text = {},
					self = d3.select( this ); // x, y, text
				text.x = parseFloat( self.attr( "x" ) ) - that.offsetLeft;
				text.y = parseFloat( self.attr( "y" ) ) - that.offsetTop;
				text.text = self.text();
				texts.push( text );
			});
			this.trigger( "text", texts );
		},

		// triggers selection event
		_triggerSelection: function() {
			this.trigger( "selection", this._allDatapoints().filter( "[data-vizboard-selected]" ).collect( "resource" ) );
		},

		// triggers arrow event
		_triggerArrow: function() {
			var arrows = [],
				that = this;
			d3.select( this.el ).selectAll( "line.assistance-annotations__arrow_finished" ).each( function() {
				var arrow = {},
					self = d3.select( this );
				arrow.x1 = parseFloat( self.attr( "x1" ) ) - that.offsetLeft;
				arrow.x2 = parseFloat( self.attr( "x2" ) ) - that.offsetLeft;
				arrow.y1 = parseFloat( self.attr( "y1" ) ) - that.offsetTop;
				arrow.y2 = parseFloat( self.attr( "y2" ) ) - that.offsetTop;

				arrows.push( arrow );
			});
			this.trigger( "arrow", arrows );
		},

		_computeRectangle: function( svgrect ) {
			var self = d3.select( svgrect ),
				rect = {},
				q = parseInt( self.attr( "data-vizboard-quadrant" ) ),
				x = parseFloat( self.attr( "x" ) ) - this.offsetLeft,
				y = parseFloat( self.attr( "y" ) ) - this.offsetTop,
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
				rect.x1 = x - w;
				rect.y1 = y - h;
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

			return rect;
		},

		// triggers rectangle event
		_triggerRectangle: function() {
			var rects = [],
				that = this;
			d3.select( this.el ).selectAll( "rect.assistance-annotations__rectangle_finished" ).each( function() {
		
				var rect = that._computeRectangle( this );
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
				var that = this;
				if ( evt.target.tagName !== "text" ) {
					var text = d3.select( this.el ).append( "text" );
					text.attr( "class", "assistance-annotations__text_content");
					text.style( "fill", "orange" ); // class did not work?
					text.attr( "x", evt.offsetX );
					text.attr( "y", evt.offsetY );
					smoke.prompt( "Please enter text:", function( t ) {
						if ( t ) {
							text.text( t );
							that._createRemoveButton( text.node() );
							that._triggerText();
						} else {
							text.remove();
						}
					});
					
					
				} else {
					// edit text
					var text = d3.select( evt.target ),
						t = text.text();

					smoke.prompt( "Please enter new text:", function( newText ) {
						if ( newText ) {
							text.text( newText );
							that._triggerText();
						}
					}, {
						"value": t
					});
						
				}
			}
		},

		// takes a rect, finds enclosed datapoints
		_findEnclosing: function( svgrect ) {
			// svgrect is an svg node, possibly transformed
			var rect = this._computeRectangle( svgrect ),
				that = this;

			// rect contains the visible coordinates
			return this._allDatapoints().filter( function( ) {
				var bbox = this.getBBox(),
					centerX = bbox.x + bbox.width / 2,
					centerY = bbox.y + bbox.height / 2;

				return  rect.x1 < centerX && centerX < rect.x2 &&
						rect.y1 < centerY && centerY < rect.y2;
			});
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
			mask.attr( "id", this.cid + "annoMask" );
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
			rect.attr( "mask", "url(#" + this.cid + "annoMask)" ); //TODO static url problematic if there are multiple views of this opened

			var marker = def.append( "marker" );
			marker.attr( "id", this.cid + "arrowhead" )
					.attr("refX", 5) /*must be smarter way to calculate shift*/
    				.attr("refY", 3)
    				.attr( "fill", "orange" )
				    .attr("markerWidth", 6)
				    .attr("markerHeight", 6)
				    .attr("orient", "auto")
				    .append("path")
        				.attr("d", "M 0,0 V 6 L6,3 Z");

			this.$el = $( this.el );
			this.bindUIElements();
		},

		_dragStartHandler: function() {
			if ( d3.event.sourceEvent.target.tagName !== "rect" ) {
				// this is to prevent really short "drags" on the remove button
				return false;
			}
			if ( this.capability === "rectangle" ) {
				var rect = d3.select( this.el ).append( "rect" );
				rect.attr( "class", "assistance-annotations__rectangle_current" );

				rect.attr( "x", d3.event.sourceEvent.offsetX );
				rect.attr( "y", d3.event.sourceEvent.offsetY );
			} else if ( this.capability === "arrow" ) {
				var arrow = d3.select( this.el ).append( "line" );
				arrow.attr( "class", "assistance-annotations__arrow_current" );
				arrow.attr( "marker-end", "url(#" + this.cid + "arrowhead)" );
				arrow.attr( "x1", d3.event.sourceEvent.offsetX );
				arrow.attr( "y1", d3.event.sourceEvent.offsetY );
				// prevent glitch that line is connected to ursprung
				arrow.attr( "x2", d3.event.sourceEvent.offsetX );
				arrow.attr( "y2", d3.event.sourceEvent.offsetY );
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
				// try to find enclosed datapoints
				var points = this._findEnclosing( rect.node() );
				this._allDatapoints().each( this._dehighlightElement );
				points.each( this._highlightElement ).attr( "data-vizboard-selected", "true" );

			} else if ( this.capability === "arrow" ) {
				var arrow = d3.select( this.el ).select( "line.assistance-annotations__arrow_current" );
				arrow.attr( "x2", d3.event.x );
				arrow.attr( "y2", d3.event.y );
			}
		},

		// see http://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
		// Calculate the bounding box of an element with respect to its parent element
		_transformedBoundingBox: function( el ) {
			var bb  = el.getBBox(),
				svg = el.ownerSVGElement,
				m   = el.getTransformToElement(el.parentNode);

			// Create an array of all four points for the original bounding box
			var pts = [
				svg.createSVGPoint(), svg.createSVGPoint(),
				svg.createSVGPoint(), svg.createSVGPoint()
			];
			pts[0].x=bb.x;          pts[0].y=bb.y;
			pts[1].x=bb.x+bb.width; pts[1].y=bb.y;
			pts[2].x=bb.x+bb.width; pts[2].y=bb.y+bb.height;
			pts[3].x=bb.x;          pts[3].y=bb.y+bb.height;

			// Transform each into the space of the parent,
			// and calculate the min/max points from that.    
			var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
			pts.forEach(function(pt){
				pt = pt.matrixTransform(m);
				xMin = Math.min(xMin,pt.x);
				xMax = Math.max(xMax,pt.x);
				yMin = Math.min(yMin,pt.y);
				yMax = Math.max(yMax,pt.y);
			});

			// Update the bounding box with the new values
			bb.x = xMin; bb.width  = xMax-xMin;
			bb.y = yMin; bb.height = yMax-yMin;
			return bb;
		},

		_createRemoveButton: function( element ) {
			var g = d3.select( this.el ).append( "g" );
			var el = d3.select( element );
			g.appendChild( el );

			// case for text and rect
			var bbox = this._transformedBoundingBox( element ),
				x = bbox.x + bbox.width,
				y = bbox.y;

			// case for arrow
			if ( element.tagName === "line" ) {
				x = parseFloat( el.attr( "x1" ) );
				y = parseFloat( el.attr( "y1" ) );
			}

			var circle = g.append( "circle" )
							.attr( "r", 10 )
							.attr( "cx", x)
							.attr( "cy", y)
							.attr( "class", "assistance-annotations__remove" );
			var line_tb = g.append( "line")
							.attr("x1", x - 5 )
							.attr("y1", y - 5 )
							.attr("x2", x + 5 )
							.attr("y2", y + 5 )
							.attr("class", "assistance-annotations__remove_line" );
			var line_bt = g.append( "line")
							.attr("x1", x - 5 )
							.attr("y1", y + 5 )
							.attr("x2", x + 5 )
							.attr("y2", y - 5 )
							.attr("class", "assistance-annotations__remove_line" );

			var button = g.selectAll( ".assistance-annotations__remove, .assistance-annotations__remove_line" );
			button.style( "display", "none" );

			g.on( "mouseover", function() {
				button.style( "display", "block" );
			})
			.on( "mouseout" , function() {
				// cannot call this on the group, because then the element would disappear too
				button.style( "display", "none" );
			});
		},

		_dragEndHandler: function() {
			var target = d3.select( d3.event.sourceEvent.target );
			if ( target.attr( "class" ) && target.attr("class").indexOf( "assistance-annotations__remove" ) >= 0 ) {
				// this is to prevent really short "drags" on the remove button
				// it they would get executed, a new remove button will be created, resulting in faulty markup
				return false;
			}

			if ( this.capability === "rectangle" ) {
				var rect = d3.select( this.el ).select( "rect.assistance-annotations__rectangle_current" );
				
				rect.attr( "class", "assistance-annotations__rectangle_finished" );
				this._createRemoveButton( rect.node() );
				this._triggerRectangle();
				// because we may have selected datapoints along the way
				this._triggerSelection();
			} else if ( this.capability === "arrow" ) {
				var arrow = d3.select( this.el ).select( "line.assistance-annotations__arrow_current" );
				arrow.attr( "class", "assistance-annotations__arrow_finished" );
				this._createRemoveButton( arrow.node() );
				this._triggerArrow();
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

			this.bindUIElements();

			var dragBehavior = d3.behavior.drag()
						.on( "dragstart", this._dragStartHandler.bind( this ) )
						.on( "drag", this._dragHandler.bind( this ) )
						.on( "dragend", this._dragEndHandler.bind( this ));

			d3.select( this.el )
				.call( dragBehavior );
		}

	});
})( jQuery );