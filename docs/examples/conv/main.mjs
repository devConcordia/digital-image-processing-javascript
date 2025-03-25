
import DIP from "../../../source/index.mjs";
import Renderer2D from "../src/js/Renderer2D.mjs";

///
window.addEventListener('load', function(e) {
	
	///
	const BLACK = DIP.Color.Hex(0x000000).getBytes();
	
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
		DIP.CreateContext( source, div );
		
		document.body.appendChild( div );
		
	}
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/valve.png', function( source, ctx ) {
		
		/// copy a grayScale image
		const graySource = DIP.GrayImageData.From( source );
		
		
		
		/// 
		addStep( '1. Input (RGBA)', source );
		
		source.conv( DIP.Matrix.Sobel() );
	//	source.conv( DIP.Matrix.Feldman() );
	//	source.conv( DIP.Matrix.Prewitt() );
	//	source.conv( DIP.Matrix.Sharpen() );
	//	source.conv( DIP.Matrix.Emboss() );
	//	source.conv( DIP.Matrix.GaussianBlur(7) );
		
		addStep( '2. Output (RGBA)', source );
		
		///
		/// grayscale
		/// 
		
		addStep( '3. Input (Gray)', graySource.getImageData() );
		
		/// 
		graySource.conv( DIP.Matrix.Sobel() );
		
		addStep( '4. Output (Gray)', graySource.getImageData() );
		
		
		
	});
	
	
}, false);
