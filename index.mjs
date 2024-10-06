
import ImageBinary from './src/ImageBinary.mjs';
import ImageGray from './src/ImageGray.mjs';
import ImageRGB from './src/ImageRGB.mjs';

import Matrix from './src/core/Matrix.mjs';

/** load
 *	
 *	@param {String} path
 *	@param {Function} handlerCallback
 */
function load( path, handlerCallback ) {
	
	var source = new Image();
	
	source.onload = function() {
		
		let context = createContext( source );
		
		handlerCallback( context );
		
	};
	
	source.src = path;
		
}

/** createContext
 *	
 *	@param {Image|HTMLCanvasElement|ImageData} source
 *	@param {HTMLElement} parentNode
 *	@return {CanvasRenderingContext2D}
 */
function createContext( source ) {
	
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
	
	///
	return context;
	
}

///
export default { 
	load, createContext,
	ImageBinary, ImageGray, ImageRGB, 
	Matrix 
};

