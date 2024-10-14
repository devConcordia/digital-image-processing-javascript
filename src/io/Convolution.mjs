
function clamp( a, b, c ) { return Math.min( Math.max( a, b ), c ) }

/** Convolution
 *	
 *	
 *	@ref https://en.wikipedia.org/wiki/Kernel_(image_processing)
 *	@ref https://pt.wikipedia.org/wiki/Filtro_Sobel
 *	
 */
export default class Convolution {
	
	static SOBEL = new Int8Array([
		-1, 0, 1,
		-2, 0, 2,
		-1, 0, 1
	]);
	
	static SOBEL_HEAVY = new Int8Array([
		-1, 0, 1,
		-5, 0, 5,
		-1, 0, 1
	]);
	
	static LAPLACE = new Int8Array([
		 0, 1, 0, 
		 1,-4, 1, 
		 0, 1, 0 
	]);
	
	static DOT = new Int8Array([
		-1,-1,-1, 
		-1, 8,-1, 
		-1,-1,-1 
	]);
	
	static SHARPEN = new Int8Array([
		 0,-1, 0, 
		-1, 5,-1, 
		 0,-1, 0 
	]);
	
	static BLUR = new Float32Array( 9 ).fill(1/9);
	
	static EMBOSS = new Int8Array([
		-2,-1, 0, 
		-1, 1, 1, 
		 0, 1, 2
	]);
	
	static createGaussianBlur( size = 5, sigma = 1.3 ) {
		
		var output = new Float32Array( size * size );
		
		var index = 0;
		
		var s1 = 2 * sigma * sigma;
		var s2 = 1 / Math.PI * s1;
		
		var half = Math.floor( size / 2 );
		
		for( var y = -half; y <= half; y++ ) {
			for( var x = -half; x <= half; x++ ) {
				
				let v = s2 * Math.exp( -((x*x + y*y) / s1) );
				
				output[ index++ ] = v/half;
			//	output[ index++ ] = (s2 * Math.exp( -((x*x + y*y) / s1) ))/2;
			//	output[ index++ ] = Math.pow(s2 * Math.exp( -((x*x + y*y) / s1) ), 16);
				
			}
		}
		
		return output;
		
	}
	
	/** operate
	 *	
	 *	@param {ImageData} input
	 *	@param {Array} mask
	 *	@return {ImageData}
	 */
	static operate( input, mask ) {
		
		var width = input.width;
		var height = input.height;
		
		var in_data = input.data;
		
		var output = new ImageData( width, height );
		var out_data = output.data;
		
		var size = Math.sqrt( mask.length );
		var half = Math.floor( size / 2 );
		
		var w = width - 1, 
			h = height - 1;
		
		var gamma = mask.reduce((a,b)=>a+b) || 1;
		
		for( var y = 0; y < height; y++ ) {
			for( var x = 0; x < width; x++ ) {

				var rx = 0, ry = 0,
					gx = 0, gy = 0,
					bx = 0, by = 0;

				for( var i = -half; i <= half; i++ ) {
					for( var j = -half; j <= half; j++ ) {
						
						var ih = i+half,
							jh = j+half;
						
						var mx = mask[ ih*size + jh ],
							my = mask[ jh*size + ih ];
						
						var xj = clamp(x+j, 0, w), 
							yi = clamp(y+i, 0, h);
					
						var n = 4 * (yi * width + xj);
						
						var r = in_data[ n++ ],
							g = in_data[ n++ ],
							b = in_data[ n   ];

						rx += r * mx;
						ry += r * my;
						
						gx += g * mx;
						gy += g * my;
						
						bx += b * mx;
						by += b * my;

					}
				}
				
				var offset = 4 * (y * width + x);
				
				out_data[ offset++ ] = clamp(Math.hypot( rx, ry )/gamma,0,255);
				out_data[ offset++ ] = clamp(Math.hypot( gx, gy )/gamma,0,255);
				out_data[ offset++ ] = clamp(Math.hypot( bx, by )/gamma,0,255);
				out_data[ offset   ] = 255;
				
			}
		}
		
		return output;
		
	}
	
	/** operate
	 *	
	 *	@param {ImageData} input
	 *	@param {Array} mask
	 *	@return {ImageData}
	 */
	static operateGray( input, mask ) {
		
		var width = input.width;
		var height = input.height;
		
		var in_data = input.data;
		
		var output = new ImageData( width, height );
		var out_data = output.data;
		
		var size = Math.sqrt( mask.length );
		var half = Math.floor( size / 2 );
		
		var w = width - 1, 
			h = height - 1;
		
		var gamma = mask.reduce((a,b)=>a+b) || 1;
		
		for( var y = 0; y < height; y++ ) {
			for( var x = 0; x < width; x++ ) {

				var rx = 0, ry = 0;

				for( var i = -half; i <= half; i++ ) {
					for( var j = -half; j <= half; j++ ) {
						
						var ih = i+half,
							jh = j+half;
						
						var xj = clamp(x+j, 0, w), 
							yi = clamp(y+i, 0, h);
					
						var n = 4 * (yi * width + xj);
						
						var r = in_data[ n++ ];

						rx += r * mask[ ih*size + jh ];
						ry += r * mask[ jh*size + ih ];
						
					}
				}
				
				var offset = 4 * (y * width + x);
				
				var r = clamp(Math.hypot( rx, ry )/gamma,0,255);
				
				out_data[ offset++ ] = r;
				out_data[ offset++ ] = r;
				out_data[ offset++ ] = r;
				out_data[ offset   ] = 255;
				
			}
		}
		
		return output;
		
	}
	
	
	static operateHUE( input, mask ) {
		
		
		var width = input.width;
		var height = input.height;
		
		var in_data = input.data;
		
		var output = new ImageData( width, height );
		var out_data = output.data;
		
		var size = Math.sqrt( mask.length );
		var half = Math.floor( size / 2 );
		
		var w = width - 1, 
			h = height - 1;
		
		var gamma = mask.reduce((a,b)=>a+b) || 1;
		
		
		for( var y = 0; y < height; y++ ) {
			for( var x = 0; x < width; x++ ) {

				var rx = 0, ry = 0;

				for( var i = -half; i <= half; i++ ) {
					for( var j = -half; j <= half; j++ ) {
						
						var ih = i+half,
							jh = j+half;
						
						var xj = clamp(x+j, 0, w), 
							yi = clamp(y+i, 0, h);
					
						var n = 4 * (yi * width + xj);
						
						var ir = in_data[ n++ ] / 255;
						var ig = in_data[ n++ ] / 255;
						var ib = in_data[ n++ ] / 255;
						
						var hue = get_hue( ir, ig, ib );
						
						rx += (hue * mask[ ih*size + jh ]) *255;
						ry += (hue * mask[ jh*size + ih ]) *255;
						
					//	rx += ir * mask[ ih*size + jh ];
					//	ry += ir * mask[ jh*size + ih ];
						
					}
				}
				
				var offset = 4 * (y * width + x);
				
				var r = clamp(Math.hypot( rx, ry )/gamma,0,255);
				
				out_data[ offset++ ] = r;
				out_data[ offset++ ] = r;
				out_data[ offset++ ] = r;
				out_data[ offset   ] = 255;
				
			}
		}
		
		return output;
		
		
	}
	
}



function get_hue( r, g, b ) {
	
	var min = Math.min( r, g, b ),
		max = Math.max( r, g, b ),
		delta = max - min;

	if( delta == 0 ) return 0;

	var h;

	switch( max ) {
		
		case r: h = ( g - b )/delta; break;
		case g: h = 2 + ( b - r )/delta; break;
		case b: h = 4 + ( r - g )/delta; break;
		
	}

	h /= 6;

	//if( h < 0 ) h += 1;
	
	return h;
	
}
