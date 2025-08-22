
import DIP from "../DIP.mjs";

window.addEventListener('load', function(e) {
	
	///
	const BLACK = DIP.Color.Hex(0x000000).getBytes();
	
	///
	const divHead = document.body.querySelector('#divHead');
	const divView = document.body.querySelector('#divView');
	
	const preLog = document.createElement('pre');
	
	function writeLog( text, color ) {
		
		if( color ) 
			text = "<span style='color:"+ color +"'>"+ text +"</span>";
		
		preLog.innerHTML += text +'\n\n';
		
	}
	
	function addButton( text, disabled, handler ) {
		
		let btn = document.createElement('button');
			btn.disabled = disabled;
			btn.innerHTML = text;
			btn.onclick = function(evt) {
				
				btn.disabled = true;
				
				let childs = Array.from( divHead.childNodes )
				let index = childs.indexOf( btn );
				
				let nextBtn = childs[index+1];
				
				if( nextBtn ) nextBtn.disabled = false;
				
				handler(evt);
				
			};
		
		divHead.appendChild( btn );
		
	}
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('./nuts-and-bolts.jpg', function( input, context2d ) {
		
		///
		divView.appendChild( preLog );
		divView.appendChild( context2d.canvas );
		
		///
		const source = input.clone();
		
		let graySource = null;
		let binarySource = null;
		let objects = null;
		
		addButton( "grayScale", false, function() {
			
			let T = Date.now();
			
		//	source.grayScale();
		//	
		//	/// update
		//	context2d.putImageData( source, 0, 0 );
			
			graySource = DIP.GrayImageData.From( source );
			
			/// update
			context2d.putImageData( graySource.getImageData(), 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] grayScale");
			
		});
		
		addButton( "Sobel", true, function() {
			
			if( graySource == null )
				return writeLog("GrayImageData not started", "#f00");
			
			let T = Date.now();
			
		//	source.conv( DIP.Matrix.Sobel(5) );
		//	
		//	/// update
		//	context2d.putImageData( source, 0, 0 );
			
			graySource.conv( DIP.Matrix.Sobel(5) );
			
			/// update
			context2d.putImageData( graySource.getImageData(), 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Sobel");
			
		});
		
	/*	addButton( "Morphology Close", true, function() {
			
			let T = Date.now();
			
			source.close( DIP.Matrix.Ones(5,5) );
			
			/// update
			context2d.putImageData( source, 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Morphology Close");
			
		}); /**/
		
		addButton( "Binarization", true, function() {
			
			if( graySource == null )
				return writeLog("GrayImageData not started", "#f00");
			
			let T = Date.now();
			
		//	source.threshold(90);
		//	
		//	/// update
		//	context2d.putImageData( source, 0, 0 );
			
			binarySource = DIP.BinaryImageData.From( graySource, 90 );
			
			/// update
			context2d.putImageData( binarySource.getImageData(), 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Binarization");
			
		});
		
		addButton( "Morphology Close", true, function() {
			
			if( binarySource == null )
				return writeLog("BinaryImageData not started", "#f00");
			
			let T = Date.now();
			
		//	source.close( DIP.Matrix.Ones(3,3) );
		//	
		//	/// update
		//	context2d.putImageData( source, 0, 0 );
			
			binarySource = binarySource.close( DIP.Matrix.Ones(3,3) );
			
			/// update
			context2d.putImageData( binarySource.getImageData(), 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Morphology Close");
			
		}); 
		
		
		addButton( "RLESegmentation", true, function() {
			
			if( binarySource == null )
				return writeLog("BinaryImageData not started", "#f00");
			
			let T = Date.now();
			
		//	let graySource = new DIP.GrayImageData( source.getChannel(0), source.width );
			let finalSource = new DIP.GrayImageData( binarySource.getChannel(), binarySource.width );
			
			
			objects = new DIP.RLESegmentation( finalSource );
			
			/// clear source
			source.fill( BLACK );
			
			/// plot objects of RLE on source
			objects.debug( source );
			
			/// update
			context2d.putImageData( source, 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] RLESegmentation");
			
		});
		
		addButton( "Remove small objects", true, function() {
			
			if( objects == null )
				return writeLog("RLESegmentation not started", "#f00");
			
			let T = Date.now();
			
			/// remove objects with area smaller than 200 pixels
			objects.filter(function(object) {
				return object.pixels < 200
			});
			
			/// clear source
			source.fill( BLACK );
			
			/// plot objects of RLE on source
			objects.debug( source );
			
			/// update
			context2d.putImageData( source, 0, 0 );
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Remove small objects");
			
		});
		
		addButton( "Merge objects", true, function() {
			
			if( objects == null )
				return writeLog("RLESegmentation not started", "#f00");
			
			let T = Date.now();
			
			/// merge object with distance (center point) smaller than 50 pixels
			objects.merge( 50 );
			
			/// clear source
			source.fill( BLACK );
			
			/// plot objects of RLE on source
			objects.debug( source );
			
			/// update
			context2d.putImageData( source, 0, 0 );
			
			writeLog("["+ (Date.now()-T) +" ms] Merge objects");
			
		});
		
		addButton( "Close objects", true, function() {
			
			if( objects == null )
				return writeLog("RLESegmentation not started", "#f00");
			
			let T = Date.now();
			
			/// merge object with distance (center point) smaller than 50 pixels
			objects.close();
			
			/// clear source
			source.fill( BLACK );
			
			/// plot objects of RLE on source
			objects.debug( source );
			
			/// update
			context2d.putImageData( source, 0, 0 );
			
			writeLog("["+ (Date.now()-T) +" ms] Close objects");
			
		});
		
		addButton( "Object's Border Data", true, function() {
			
			if( objects == null )
				return writeLog("RLESegmentation not started", "#f00");
			
			context2d.putImageData( input, 0, 0 );
			
			
			let T = Date.now();
			
			///
			for( let object of objects ) {
				
				let { points, center, near, far } = object.getBorderData();
				
				context2d.strokeStyle = "#fff";
				context2d.lineWidth = 2;
				context2d.beginPath();
				context2d.moveTo( ...points[0] );
				
				for( let i = 1; i < points.length; i++ )
					context2d.lineTo( ...points[i] );
				
				///
				context2d.closePath();
				context2d.stroke();
				
				
				context2d.moveTo( ...center );
				context2d.lineTo( ...near );
				context2d.stroke();
				
				context2d.moveTo( ...center );
				context2d.lineTo( ...far );
				context2d.stroke();
				
				
			}
			
			writeLog("["+ (Date.now()-T) +" ms] Object's Border Data");
			
		});
		
		addButton( "Recognize", true, function() {
			
			if( objects == null )
				return writeLog("RLESegmentation not started", "#f00");
			
			
			let T = Date.now();
			
			const BOLT = DIP.Color.Hex( 0xff0000 );
			const NUT = DIP.Color.Hex( 0x00ff00 );
			const FERRULE = DIP.Color.Hex( 0x0000ff );
			
			const MinDevBolt = 30;
		
			const MaxNutCompos = 6800;
			
			for( let object of objects ) {
				
				let border = object.getBorderData();
				
				/// To detect bolts is very easy; are the objects with
				/// high deviation value
				if( border.distDeviation > MinDevBolt ) {
					
					object.color = BOLT;
					
				} else {
				
					/// This is more difficult, nuts and ferrules are very similar,
					/// but a composition using several characteristics can highlight
					/// small differences.
					
					/// Near/far proportion
					let nearDelta = border.near.distance( border.center );
					let farDelta = border.near.distance( border.center );
					let nfp = 100*( nearDelta / farDelta);
					
					/// density, nfp and deviation composition
					let dens = object.pixels / (object.width * object.height);
					let compos = ((dens*100)*nfp) / border.distDeviation;
					
				//	console.log( object.id, compos );
					
					object.color = (compos < MaxNutCompos)? NUT : FERRULE;
					
				}
				
			}
			
			/// clear source
			source.fill( BLACK );
			
			/// plot objects of RLE on source
			objects.debug( source );
			
			/// blen input with objects recognized
			const output = input.blend( source, 1.0, .5 );
			
			/// update
			context2d.putImageData( output, 0, 0 );
			
		//	context2d.fillStyle = "#fff";
		//	context2d.font = "16px Comic Sans MS";
		//	
		//	for( let object of objects ) {
		//		
		//		let px = Math.floor( object.x + object.width/2 );
		//		let py = Math.floor( object.y + object.height/2 );
		//		
		//		context2d.fillText( object.id, px, py );
		//		
		//	}
			
			///
			writeLog("["+ (Date.now()-T) +" ms] Recognize");
			
		});
		
	});
	
}, false);
