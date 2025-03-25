
import DIP from "../../../source/index.mjs";
import Renderer2D from "../src/js/Renderer2D.mjs";

///
window.addEventListener('load', function(e) {
	
	///
	const BLACK = DIP.Color.Hex(0x000000).getBytes();
	const RED = DIP.Color.Hex(0xff0000).getBytes();
	
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
		if( source ) 
			DIP.CreateContext( source, div );
		
		document.body.appendChild( div );
		
	}
	
	/// DIP.Load() load a image as ColorImageData
//	DIP.Load('../src/img/iris.png', function( source, ctx ) {
	DIP.Load('../src/img/circles.jpg', function( source, ctx ) {
		
		let input = source.clone();
		
	//	let graySource = DIP.GrayImageData.Create( source );
		
		/// 1. show input
		addStep( '1. Input', source );
		
		source.grayScale();
		
		/// 2.2. border detection with Sobel
		source.conv( DIP.Matrix.Sobel(5) );
		
		/// 2.3. close operation (morphology)
		source.close( DIP.Matrix.Ones( 5, 5 ) );
		
		/// 2.4. binarization (with simple thresholding)
		source.threshold(75);
		
		/// 2.5. init Run Length Encoding Segmentation (RLESegmentation)
		let objects = DIP.RLESegmentation.Create( source );
		
		objects.close();
		
		/// remove objects with area smaller than 200 pixels
		objects.remove(function(object) { return object.pixels < 1500 });
		
		/// clear source
		source.fill( BLACK );
		/// plot objects of RLE on source
		objects.stamp( source );
		addStep( '2. Debug', source );
		
		
		addStep( '3. Output' );
		
		for( let object of objects ) {
			
			let cropped = input.crop( object.x, object.y, object.width, object.height );
			
			let w = cropped.width,
				h = cropped.height;
			
			let cx = w/2,
				cy = h/2;
			
			let radius = w/2;
			
			
			let perimeter = Math.round(2 * Math.PI * radius);
						
		//	let step = 360 / (perimeter-1);
			let step = 360 / (perimeter);
			
			let lines = new Array();
			
			for( let i = 0; i < 360; i += step ) {
							
				let d = i * Math.PI / 180;
				
				let x = Math.round( cx + radius * Math.cos( d ) );
				let y = Math.round( cy + radius * Math.sin( d ) );
				
				lines.push( cropped.getLine( cx, cy, x, y ) );
				
				/// debug
			//	cropped.setLine( cx, cy, x, y, RED );
				
			}
	
			
			let oh = lines.length,
				ow = lines[0].length;
			
		//	let output = new DIP.ColorImageData( ow, oh );
			let output = new DIP.ColorImageData( oh, ow );
			let buffer = new Uint32Array( output.data.buffer );
			
			for( let y = 0; y < oh; y++ ) {
				for( let x = 0; x < ow; x++ ) {
					
				//	buffer[ y*ow+x ] = lines[y][x];
					buffer[ x*oh+y ] = lines[y][x];
					
				}
			}
			
			addStep( '', output );
			
		}
		
		
		
	//	addStep( '2. Output (RGBA)', source );
		
		
		
	});
	
	
}, false);
