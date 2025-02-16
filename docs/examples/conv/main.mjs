
import pixel from "../../../index.mjs";
import Renderer2D from "../src/js/Renderer2D.mjs";

///
window.addEventListener('load', function(e) {
	
	///
	const BLACK = pixel.Color.Hex(0x000000).getBytes();
	
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
	
	/// pixel.load() load a image as RGBAImageData
	pixel.load('../src/img/valve.png', function( source, ctx ) {
		
		const graySource = pixel.GrayImageData.Create( source );
		
		
		
		/// 1. show input
		addStep( '1. Input (RGBA)', source );
		
		/// 
		source.conv( pixel.Matrix.Sobel() );
	//	source.conv( pixel.Matrix.Feldman() );
	//	source.conv( pixel.Matrix.Prewitt() );
	//	source.conv( pixel.Matrix.Sharpen() );
	//	source.conv( pixel.Matrix.Emboss() );
	//	source.conv( pixel.Matrix.GaussianBlur(7) );
		
		addStep( '2. Output (RGBA)', source );
		
		///
		
		
		/// 3. show input
		addStep( '1. Input (Gray)', graySource.getImageData() );
		
		/// 
		graySource.conv( pixel.Matrix.Sobel() );
		
		addStep( '4. Output (Gray)', graySource.getImageData() );
		
		
		
	});
	
	
}, false);
