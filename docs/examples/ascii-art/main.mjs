
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
	
	/// pixel.load() load a image as ColorImageData
	pixel.load('../src/img/octocat.png', function( source, ctx ) {
		
		const graySource = pixel.GrayImageData.From( source, { scale: [.25,.25] });
		
		///
		addStep( '1. Input', source );
		
		let asciiArt = graySource.toString();
		
		addStepString( '2. Output', asciiArt );
		
	});
	
	
}, false);
