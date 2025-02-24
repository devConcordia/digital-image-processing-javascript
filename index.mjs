
import Rect from './source/common/Rect.mjs';
import Point from './source/common/Point.mjs';
import Color from './source/common/Color.mjs';
import Matrix from './source/common/Matrix.mjs';

//import RGBAImageData from './source/RGBAImageData.mjs';
import ColorImageData from './source/ColorImageData.mjs';
import GrayImageData from './source/GrayImageData.mjs';
import BinaryImageData from './source/BinaryImageData.mjs';

import RLESegmentation from './source/RLE/RLESegmentation.mjs';

///
///
///

/** load
 *	
 *	@param {String} path
 *	@param {Function} handlerCallback
 */
function load( path, handlerCallback ) {
	
	var source = new Image();
	
	source.onload = function() {
		
		const context = createContext( source );
		const imagedata = context.getImageData(0,0,source.width, source.height);
		
		/// extends to RGBAImageData
		ColorImageData.Extends( imagedata );
		
		///
		handlerCallback( imagedata, context );
		
	};
	
	source.src = path;
		
}

/** createContext
 *	
 *	@param {Image|HTMLCanvasElement|ImageData} source
 *	@param {HTMLElement} parentNode
 *	@return {CanvasRenderingContext2D}
 */
function createContext( source, parentNode = null ) {
	
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
	
	if( source ) {
		
		canvas.width = source.width;
		canvas.height = source.height;
		
		if( source instanceof Image || source instanceof HTMLCanvasElement) {
			
			context.drawImage( source, 0, 0, source.width, source.height );
		
		} else if( source instanceof ImageData ) {
			
			context.putImageData( source, 0, 0 );
		
		}
		
	}
	
	if( parentNode instanceof HTMLElement )
		parentNode.appendChild( canvas );
	
	///
	return context;
	
}

///
export default {
	
	load,
	createContext,
	
	Rect,
	Point,
	Color,
	Matrix,
	
//	RGBAImageData,
	ColorImageData,
	GrayImageData,
	BinaryImageData,

	RLESegmentation
	
}

