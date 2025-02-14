
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
	function createHistogramChart( source ) {
		
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
	
	
	
	/// pixel.load() load a image as RGBAImageData
	pixel.load('../src/img/rock.jpg', function( source, ctx ) {
		
		/// 1. show input
		addStep( '1. Input', source );
		
		let histInputCanvas = createHistogramChart( source );
		
		addStep( '1.2. Input Histogram', histInputCanvas );
		
		/// 
		source.clahe();
		
		addStep( '2. Output', source );
		
		let histOutputCanvas = createHistogramChart( source );
		
		addStep( '2.2. Output Histogram', histOutputCanvas );
		
	});
	
	
}, false);
