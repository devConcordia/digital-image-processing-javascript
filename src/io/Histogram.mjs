
/** Histogram
 *	
 */
export default class Histogram {
	
	/** Histogram Gray (RED channel) 
	 *	
	 *	@param {ImageData} imagedata
	 *	@param {Number} wx, wy, ww, wh		window rect
	 *	@return {Object}
	 */
	static Gray( imagedata, wx, wy, ww, wh ) {
		
		let width = imagedata.width;
		
		if( wx == undefined ) wx = 0;
		if( wy == undefined ) wy = 0;
		if( ww == undefined ) ww = width;
		if( wh == undefined ) wh = imagedata.height;
		
		let output = new Object;
		
		let data = imagedata.data;
		
		let wmax = wx + ww;
		let hmax = wy + wh;
		
		for( let y = wy; y < hmax; y++ ) {
			
			let offset = y * width;
			
			for( let x = wx; x < wmax; x++ ) {
				
				let i = 4*(offset + x);
				let v = data[i];
				
				if( !(v in output) ) output[ v ] = 0;
				
				output[ v ]++;
				
			}
		}
		
		return output;
		
	}
	
	/** HistogramRGB
	 *	
	 *	@param {ImageData} imagedata
	 *	@param {Number} wx, wy, ww, wh		window rect
	 *	@return {Object}
	 */
	static RGB( imagedata, wx, wy, ww, wh ) {
		
		let width = imagedata.width;
		
		if( wx == undefined ) wx = 0;
		if( wy == undefined ) wy = 0;
		if( ww == undefined ) ww = width;
		if( wh == undefined ) wh = imagedata.height;
		
		let red = new Object;
		let green = new Object;
		let blue = new Object;
		
		let data = imagedata.data;
		
		let wmax = wx + ww;
		let hmax = wy + wh;
		
		for( let y = wy; y < hmax; y++ ) {
			
			let offset = y * width;
			
			for( let x = wx; x < wmax; x++ ) {
				
				let i = 4*(offset + x);
				let vr = data[i  ];
				let vg = data[i+1];
				let vb = data[i+2];
				
				if( !(vr in red) ) red[ vr ] = 0;
				if( !(vg in green) ) green[ vg ] = 0;
				if( !(vb in blue) ) blue[ vb ] = 0;
				
				red[ vr ]++;
				green[ vg ]++;
				blue[ vb ]++;
				
			}
		}
		
		return { red, green, blue }
		
	}
	
	
	
	
	static Equalize({ width, height, data }, histogram) {
		
		let output = new ImageData( width, height );
		let outdata = output.data;
		
		let min = Math.min(...histogram);
		let max = Math.max(...histogram);
		
		for( let i = 0; i < data.length; i+=4 ) {
			
			let v = histogram[ data[i] ];
				v = Math.round(255 * (v - min) / (max - min));
			
			outdata[ i   ] = v;
			outdata[ i+1 ] = v;
			outdata[ i+2 ] = v;
			outdata[ i+3 ] = 255;
			
		}
		
		return output;
		
	}
	
	
	
	/** 
	 *	
	 *	@param {ImageData} imagedata
	 */
	static Clahe( imagedata ) {
		
		let { width, height, data } = imagedata;
		
		/// equalized_image
		let output = new ImageData( width, height );
		
		/// padded_equalized_image
		let outdata = output.data;
		
		///
		let hist = Histogram.Gray( imagedata, 0, 0, width, height );
		
		/// Calculating the CDF
		let cdf = Histogram.Cdf( hist );
		
		///
		for( let i = 0; i < data.length; i+=4 ) {
			
			let v = cdf[ data[ i ] ];
						
			outdata[ i   ] = v;
			outdata[ i+1 ] = v;
			outdata[ i+2 ] = v;
			outdata[ i+3 ] = 255;
			
		}
		
		
	//	for( let y = 0; y < height; y++ ) {
	//		for( let x = 0; x < width; x++ ) {
	//			
	//			let sx = Math.min( Math.max( x - half, 0 ), limw );
	//			let sy = Math.min( Math.max( y - half, 0 ), limh );
	//			
	//			let hist = Histogram.Gray( imagedata, sx, sy, size, size );
	//			
	//			/// Calculating the CDF
	//			let cdf = Histogram.Cdf( hist );
	//			
	//			
	//			let k = ( y * width + x ) * 4;
	//			
	//			let v = cdf[ data[ k ] ];
	//					
	//			outdata[ k   ] = v;
	//			outdata[ k+1 ] = v;
	//			outdata[ k+2 ] = v;
	//			outdata[ k+3 ] = 255;
	//			
	//		}
	//	}
	//	
		return output;
		
	}
	
	
	/** 
	 *	
	 *	@param {ImageData} imagedata	
	 */
	static ClaheRGB( imagedata ) {
		
		let { width, height, data } = imagedata;
		
		/// equalized_image
		let output = new ImageData( width, height );
		
		/// padded_equalized_image
		let outdata = output.data;
		
		///
		let { red, green, blue } = Histogram.RGB( imagedata, 0, 0, width, height );
		
		/// Calculating the CDF
		let cdf_r = Histogram.Cdf( red );
		let cdf_g = Histogram.Cdf( green );
		let cdf_b = Histogram.Cdf( blue );
		
		console.log( JSON.stringify(cdf_r) )
		console.log( JSON.stringify(cdf_g) )
		console.log( JSON.stringify(cdf_b) )
		
		///
		for( let i = 0; i < data.length; i+=4 ) {
			
			outdata[ i   ] = cdf_r[ data[ i   ] ];
			outdata[ i+1 ] = cdf_g[ data[ i+1 ] ];
			outdata[ i+2 ] = cdf_b[ data[ i+2 ] ];
			outdata[ i+3 ] = 255;
			
		}
		
		return output;
		
	}
	
	
	/** 
	 *	
	 *	@param {ImageData} imagedata	
	 *	@param {Number} size
	 */
	static ClaheWindow( imagedata, size = 5 ) {
		
		let { width, height, data } = imagedata;
		
	//	var size = Math.sqrt( mask.length );
		var half = Math.floor( size / 2 );
		
		
		var limw = width - size, 
			limh = height - size;
		
		/// equalized_image
		let output = new ImageData( width, height );
		
		/// padded_equalized_image
		let outdata = output.data;
		
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {
				
				let sx = Math.min( Math.max( x - half, 0 ), limw );
				let sy = Math.min( Math.max( y - half, 0 ), limh );
				
				let hist = Histogram.Gray( imagedata, sx, sy, size, size );
				
				/// Calculating the CDF
				let cdf = Histogram.Cdf( hist );
				
				
				let k = ( y * width + x ) * 4;
				
				let v = cdf[ data[ k ] ];
						
				outdata[ k   ] = v;
				outdata[ k+1 ] = v;
				outdata[ k+2 ] = v;
				outdata[ k+3 ] = 255;
				
			}
		}
		
		return output;
		
	}
	
	/** 
	 *	
	 *	@param {ImageData} imagedata	
	 *	@param {Number} size			
	 */
	static ClaheRGBWindow( imagedata, size = 5 ) {
		
		let { width, height, data } = imagedata;
		
		var half = Math.floor( size / 2 );
		
		
		var limw = width - size, 
			limh = height - size;
		
		/// equalized_image
		let output = new ImageData( width, height );
		
		/// padded_equalized_image
		let outdata = output.data;
		
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {
				
				let sx = Math.min( Math.max( x - half, 0 ), limw );
				let sy = Math.min( Math.max( y - half, 0 ), limh );
				
				let { red, green, blue } = Histogram.RGB( imagedata, sx, sy, size, size );
				
				/// Calculating the CDF
				let cdf_r = Histogram.Cdf( red );
				let cdf_g = Histogram.Cdf( green );
				let cdf_b = Histogram.Cdf( blue );
				
				
				let k = ( y * width + x ) * 4;
					
				outdata[ k   ] = cdf_r[ data[ k   ] ];
				outdata[ k+1 ] = cdf_g[ data[ k+1 ] ];
				outdata[ k+2 ] = cdf_b[ data[ k+2 ] ];
				outdata[ k+3 ] = 255;
				
			}
		}
		
		return output;
		
	}
	
	
	/**	Calculates the normalized CDF (Cumulative Distribution Function)
	 *	for the histogram.
	 *
	 *	Parameters:
	 *		hist: frequencies of each pixel.
	 *		bins: pixels.
	 *
	 *	Returns the CDF in a dictionary.
	 */
	static Cdf( histogram ) {
		
		let hist = Object.values( histogram );
		let bins = Object.keys( histogram );
		
		
		let sum = 0;
		for( let x of hist ) sum += x;
		
		
		let pixel_probability = [];
		
		for( let i = 0; i < hist.length; i++ )
			pixel_probability[i] = hist[i] / sum;
		
		
		
		/// Calculating the CDF (Cumulative Distribution Function)
		///	cdf = np.cumsum(pixel_probability)
		let cdf = [ pixel_probability[0] ];
		
		for( let i = 1; i < pixel_probability.length; i++ )
			cdf[i] = pixel_probability[i] + cdf[i-1];
		
		
		let hist_eq = new Object;
		
		for( let i = 0; i < bins.length; i++ )
			hist_eq[ bins[i] ] = Math.floor( 256 * cdf[ i ] );
		
		return hist_eq;

	}

}
