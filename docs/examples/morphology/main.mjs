
import DIP from "../../../index.mjs";
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
		DIP.CreateContext( source, div );
		
		document.body.appendChild( div );
		
	}


	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/valve.png', function( source, ctx ) {
		
		const graySource = DIP.GrayImageData.From( source );
		
		let m7 = DIP.Matrix.Ones(7,7);
		
		/// gray
		addStep( '1. Input (Gray)', graySource.getImageData() );
		addStep( '2. Output Open (Gray)', graySource.clone().open( m7 ).getImageData() );
		addStep( '3. Output Close (Gray)', graySource.clone().close( m7 ).getImageData() );
		
	});
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/nuts-and-bolts.jpg', function( source, ctx ) {
		
		const graySource = DIP.GrayImageData.From( source );
		
		graySource.conv( DIP.Matrix.Sobel() );
		
		const binarySource = DIP.BinaryImageData.From( graySource );
		
		let m3 = DIP.Matrix.Ones(3,3);
		
		/// Binary
		addStep( '4. Input (Binary)', binarySource.getImageData() );
		addStep( '5. Output Open (Binary)', binarySource.open( m3 ).getImageData() );
		addStep( '6. Output Close (Binary)', binarySource.close( m3 ).getImageData() );
			
		
	});
	
	
}, false);
