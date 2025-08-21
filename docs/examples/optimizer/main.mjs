
import DIP from "../../../source/index.mjs";
import optimizer from "../../../source/optimizer.mjs";

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
	
	optimizer.loadWasm( '../../../source/optimizer/pkg/optimizer_bg.wasm', function() {
		
		/// DIP.Load() load a image as ColorImageData
		DIP.Load('../src/img/valve.png', function( source, ctx ) {
			
			/// 
			addStep( '1. Input', source );
			
			optimizer.color.conv( source, DIP.Matrix.Sobel() );
			
			addStep( '2. Conv', source );
			
			optimizer.color.grayScale( source );
			
			addStep( '3. GrayScale', source );
			
			optimizer.color.close( source, DIP.Matrix.Ones(5,5) );
			
			addStep( '4. Close', source );
			
		});
	
	});
	
}, false);
