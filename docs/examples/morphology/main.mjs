
import pixel from "../../../index.mjs";
import Renderer2D from "../src/js/Renderer2D.mjs";

///
window.addEventListener('load', function(e) {
	
	/** addStep
	 *	
	 *	@param {String} title
	 *	@param {ImageData} source
	 */
	function addStep( title, source ) {
		
		///
		let div = document.createElement('div');
		
		let p = document.createElement('p');
			p.innerHTML = title;
		
		div.appendChild( p );
		
		///
		pixel.createContext( source, div );
		
		document.body.appendChild( div );
		
	}


	/// pixel.load() load a image as ColorImageData
	pixel.load('../src/img/valve.png', function( source, ctx ) {
		
		const graySource = pixel.GrayImageData.From( source );
		
		let m7 = pixel.Matrix.Ones(7,7);
		
		/// gray
		addStep( '1. Input (Gray)', graySource.getImageData() );
		addStep( '2. Output Open (Gray)', graySource.clone().open( m7 ).getImageData() );
		addStep( '3. Output Close (Gray)', graySource.clone().close( m7 ).getImageData() );
		
	});
	
	/// pixel.load() load a image as ColorImageData
	pixel.load('../src/img/nuts-and-bolts.jpg', function( source, ctx ) {
		
		const graySource = pixel.GrayImageData.From( source );
		
		graySource.conv( pixel.Matrix.Sobel() );
		
		const binarySource = pixel.BinaryImageData.From( graySource );
		
		let m3 = pixel.Matrix.Ones(3,3);
		
		/// Binary
		addStep( '4. Input (Binary)', binarySource.getImageData() );
		addStep( '5. Output Open (Binary)', binarySource.open( m3 ).getImageData() );
		addStep( '6. Output Close (Binary)', binarySource.close( m3 ).getImageData() );
			
		
	});
	
	
}, false);
