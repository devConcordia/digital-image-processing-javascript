
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
	
	
	
	/** fixHistogramData
	 *	
	 *	@param {Object} counts			like a `{ 0: 5, 3: 100, ..., 254: 10 }`
	 *	@return {Uint32Array[256]}
	 */
	function fixHistogramData( counts ) {
		
		let output = new Uint32Array( 256 );
		
		for( let k in output )
			output[k] = counts[k] || 0;
		
		return output;
		
	}
	
	/** createHistogramChart
	 *	
	 *	@param {RGBAImageData} source
	 *	@return {HTMLCanvasElement}
	 */
	function createRGBHistogramChart( source ) {
		
		let [ red, green, blue ] = source.getHistogram();
		
		///
		red = fixHistogramData( red );
		green = fixHistogramData( green );
		blue = fixHistogramData( blue );
		
		///
		let renderer = new Renderer2D( 815, 300 );
		let chart = renderer.createChart( 25, 25, 255 * 3, 255 );
		
		chart.clear('#fff');
		chart.save({ strokeStyle: "#ddd", setLineDash:[5,5] });
		chart.grid( 16, 16 );
		
		chart.bars([ red, green, blue ], [ "#f00", "#0f0", "#00f" ]);
		
	//	document.body.appendChild( renderer.canvas );
		
		return renderer.canvas;
		
	}
	
	/** createGrayHistogramChart
	 *	
	 *	@param {GrayImageData} source
	 *	@return {HTMLCanvasElement}
	 */
	function createGrayHistogramChart( source ) {
		
		let hist = source.getHistogram();
		
		hist = fixHistogramData( hist );
		
		console.log( hist )
		
		///
		let renderer = new Renderer2D( 815, 300 );
		let chart = renderer.createChart( 25, 25, 255 * 3, 255 );
		
		chart.clear('#fff');
		chart.save({ strokeStyle: "#ddd", setLineDash:[5,5] });
		chart.grid( 16, 16 );
		
		chart.bars( hist, "#222" );
		
	//	document.body.appendChild( renderer.canvas );
		
		return renderer.canvas;
		
	}
	
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/rock.jpg', function( source, ctx ) {
		
		/// 1. show input
		addStep( '1.1. Input', source );
		
		let histInputCanvas = createRGBHistogramChart( source );
		
		addStep( '1.2. Input Histogram', histInputCanvas );
		
		/// 
		source.clahe();
		
		addStep( '2.1. Output', source );
		
		let histOutputCanvas = createRGBHistogramChart( source );
		
		addStep( '2.2. Output Histogram', histOutputCanvas );
		
	});
	
	
	/// DIP.Load() load a image as ColorImageData
	DIP.Load('../src/img/x-ray.jpg', function( source, ctx ) {
		
		///
		let graySource = DIP.GrayImageData.From( source );
		
		/// 3. show input
		addStep( '3.1. Input', graySource.getImageData() );
		
		let histInputCanvas = createGrayHistogramChart( graySource );
		
		addStep( '3.2. Input Histogram', histInputCanvas );
		
		/// 
		graySource.clahe();
		
		addStep( '4.1. Output', graySource.getImageData() );
		
		let histOutputCanvas = createGrayHistogramChart( graySource );
		
		addStep( '4.2. Output Histogram', histOutputCanvas );
		
	});
	
	
}, false);
