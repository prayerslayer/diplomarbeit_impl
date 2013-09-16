/*
 *	Utility
 *	===================
 *	
 *	Utility functions go here.
 *
 *	@author npiccolotto
*/
var assistance = assistance || {};

( function( $ ) {
	assistance.Utility = {
		// see http://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
		// Calculate the bounding box of an element with respect to its parent element
		transformedBoundingBox: function( el ) {
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

		// calculates the VISIBLE bounding box of child inside parent
		// if the child itself is 5000 px long but inside a container of 100px width, the bounding box will return 100px width.
		insideBoundingBox: function( parent, child ) {
			var p = $( parent )[ 0 ],
				c = $( child )[ 0 ],
				offsetLeft = 0,
				offsetTop = 0,
				width = Infinity,
				height= Infinity;

			do {
				offsetLeft += c.offsetLeft;
				offsetTop += c.offsetTop;
				width = $(c).width() < width ? $(c).width() : width;
		        height= $(c).height() < height ? $(c).height() : height;
		    	c = c.parentNode;
			} while( c != p );


			// check boundaries
			if ( width > $(p).width() ) {
				// overflow x
				width = $(p).width();
			}

			if ( height > $(p).height() ) {
				// overflow y
				height = $(p).height();
			}

			if ( offsetLeft < 0 ) {
				// underflow x
				offsetLeft = 0;
			}

			if ( offsetTop < 0 ) {
				// underflow y
				offsetTop = 0;
			}

			console.debug( offsetLeft, offsetTop, width, height );
			return {
				"x": offsetLeft,
				"y": offsetTop,
				"width": width,
				"height": height
			};
		},

		isSvgElement: function( node ) {
			return node.namespaceURI === "http://www.w3.org/2000/svg";
		}
	}
})( jQuery );