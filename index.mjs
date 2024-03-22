
import ImageBinary from './ImageBinary.mjs';
import ImageGray from './ImageGray.mjs';
import ImageRGB from './ImageRGB.mjs';

import Matrix from './core/Matrix.mjs';


function Load( path, handlerCallback ) {
	
	var source = new Image();
	
	source.onload = function() {
		
		let context = CreateContext2D( source );
		
		let imagedata = context.getImageData( 0, 0, source.width, source.height );
		
		handlerCallback( context, imagedata );
		
	};
	
	source.src = path;
		
}


function CreateContext2D( source ) {
	
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
	
	canvas.width = source.width;
	canvas.height = source.height;
	
	if( source instanceof Image ) {
		
		context.drawImage( source, 0, 0, source.width, source.height );
	
	} else if( source instanceof ImageData ) {
		
		context.putImageData( source, 0, 0 );
	
	}

	return context;
	
}

const pixel = { ImageBinary, ImageGray, ImageRGB, Matrix, Load, CreateContext2D };

export default pixel;
