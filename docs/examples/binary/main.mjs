
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
		
	//	console.log( source )
		
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
	DIP.Load('../src/img/figure-11.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Remove noise';
		
		document.body.appendChild( p );
		
		///
		let binarySource = DIP.BinaryImageData.From( source );
		
	//	console.log( binarySource )
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = DIP.Matrix.Ones(3,3);
		
		/// remove noise (whit morphology)
		let output = binarySource.hitOrMiss( matrix );
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/figure-16.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Extract Boundary';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = DIP.BinaryImageData.From( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = DIP.Matrix.Ones(3,3);
		
		/// boundary extraction (with morphology)
		let output = binarySource.boundary( matrix );
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/figure-63.jpg', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Fill Holes';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = DIP.BinaryImageData.From( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		let output = binarySource.fillHoles();
		
		/// show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/horse.png', function( source, ctx ) {
		
		let p = document.createElement('p');
			p.innerHTML = 'Thinning';
		
		document.body.appendChild( p );
		
		
		
		let binarySource = DIP.BinaryImageData.From( source );
		
		/// 1. show input
		addStep( '1. Input', binarySource.getImageData() );
		
		/// 
		let matrix = DIP.Matrix.Radial(3);
		
		let output = binarySource.thinning( matrix );
		
		/// 2. show output
		addStep( '2. Output', output.getImageData() );
		
	});
	
	/**/
	
}, false);
