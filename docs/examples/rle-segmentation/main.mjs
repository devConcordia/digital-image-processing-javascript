
import DIP from "../../../index.mjs";

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
	DIP.Load('../src/img/nuts-and-bolts.jpg', function( source, ctx ) {
		
		/// 1. save input
		const input = source.clone();
		
		addStep( '1. Input', input );
		
		/// 2.1. grayscale filter
		source.grayScale();
		addStep( '2.1. GrayScale', source );
		
		/// 2.2. border detection with Sobel
		source.conv( DIP.Matrix.Sobel(5) );
		addStep( '2.2. Sobel', source );
		
		/// 2.3. close operation (morphology), opcional?
	//	source.close( DIP.Matrix.Ones( 3, 3 ) );
	//	addStep( '2.3. Morphology Close', source );
		
		/// 2.4. binarization (with simple thresholding)
		source.threshold(90);
		addStep( '2.4. Threshold', source );
		
		
		/// 2.5. init Run Length Encoding Segmentation (RLESegmentation)
		let objects = DIP.RLESegmentation.Create( source );
		
		/// clear source
		source.fill( BLACK );
		/// plot objects of RLE on source
		objects.stamp( source );
		addStep( '2.5. Init RLESegmentation', source );
		
		
		/// remove objects with area smaller than 200 pixels
		objects.remove(function(object) { return object.pixels < 200 });
		
		/// clear source
		source.fill( BLACK );
		/// plot objects of RLE on source
		objects.stamp( source );
		addStep( '2.6. Remove Objects with are smaller than 200 pixels', source );
		
		
		/// merge object with distance (center point) smaller than 50 pixels
		objects.merge( 50 );
		
		/// clear source
		source.fill( BLACK );
		/// plot objects of RLE on source
		objects.stamp( source );
		addStep( '2.7. Merge objects', source );
		
		/// close objects of RLE (remove internal holes)
		objects.close();
		
		/// clear source
		source.fill( BLACK );
		/// plot objects of RLE on source
		objects.stamp( source );
		addStep( '2.8. Fill holes', source );

		
		/// create a output (blend input with current source)
		const output = input.blend( source, 1.0, .5 );
		
		const RED = DIP.Color.Hex(0xff0000).getBytes();
		
		for( let object of objects ) {
			
			let { x, y, width, height } = object;
			
			output.setLine( x, y, x+ width, y, RED );
			output.setLine( x+ width, y, x+ width, y+height, RED );
			output.setLine( x+ width, y+height, x, y+height, RED );
			output.setLine( x, y+height, x, y, RED );
			
		}
		
		addStep( '3. Output', output );
		
		
	});
	
	
}, false);
