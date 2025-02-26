
import DIP from "../../../index.mjs";
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
	
	function addStepString( title, text ) {
		
		
		///
		let div = document.createElement('div');
		
		let p = document.createElement('p');
			p.innerHTML = title;
		
		let pre = document.createElement('pre');
			pre.innerHTML = text;
			
		div.appendChild( p );
		div.appendChild( pre );
		
		document.body.appendChild( div );
		
	}
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/octocat.png', function( source, ctx ) {
		
		const graySource = DIP.GrayImageData.From( source, { scale: [.25,.25] });
		
		///
		addStep( '1. Input', source );
		
		let asciiArt = graySource.toString();
		
		addStepString( '2. Output', asciiArt );
		
	});
	
	
}, false);
