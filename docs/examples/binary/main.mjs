
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
	pixel.load('../src/img/figure-11.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Remove noise';
		
		document.body.appendChild( p );
		
		///
		let binarySource = pixel.BinaryImageData.FromImageData( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = pixel.Matrix.Ones(3,3);
		
		/// remove noise (whit morphology)
		let output = binarySource.hitOrMiss( matrix );
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	
	/// pixel.load() load a image as RGBAImageData
	pixel.load('../src/img/figure-16.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Extract Boundary';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = pixel.BinaryImageData.FromImageData( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = pixel.Matrix.Ones(3,3);
		
		/// boundary extraction (with morphology)
		let output = binarySource.boundary( matrix );
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	
	
	/// pixel.load() load a image as RGBAImageData
	pixel.load('../src/img/figure-63.jpg', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Fill Holes';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = pixel.BinaryImageData.FromImageData( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		let output = binarySource.filler();
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	/**/
	
	
	/// pixel.load() load a image as RGBAImageData
	pixel.load('../src/img/horse.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Thinning';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = pixel.BinaryImageData.FromImageData( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = pixel.Matrix.Radial(3);
		
		let output = binarySource.thinning( matrix );
		
		/// 2. show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	/**/
	
}, false);
