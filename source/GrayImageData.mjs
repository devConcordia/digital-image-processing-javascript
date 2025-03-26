
import { clamp, calcCdf, outRange } from './common/utils.mjs';
import { wasm } from './optimizer.mjs'

/** GrayImageData
 *	
 */
export default class GrayImageData {
	
	/** 
	 *	
	 *	@param {Number} width
	 *	@param {Number} height
	 *	or
	 *	@param {TypedArray} dataArray
	 *	@param {Number} width
	 *	or
	 *	@param {TypedArray} dataArray
	 *	@param {Number} width
	 *	@param {Number} height
	 */
	constructor() {
		
		let dataArray, width, height;
		
		if( arguments.length == 3 ) {
			
			dataArray = arguments[0];
			width = arguments[1];
			height = arguments[2];
			
		} else {
			
			if( typeof arguments[0] == 'number' ) {
				
				width = arguments[0];
				height = arguments[1];
				
				dataArray = width * height;
				
			} else {
				
				dataArray = arguments[0];
				width = arguments[1];
				height = dataArray.length / width;
				
			}
			
		}
		
		this.data = new Uint8ClampedArray( dataArray );
		this.width = width;
		this.height = height;
		
	}
	
	/** From
	 *	
	 *	
	 *	options.crop[0]				x to clip a frame. Default is 0
	 *	options.crop[1]				y to clip a frame. Default is 0
	 *	options.crop[2]				width to clip a frame. Default is input width
	 *	options.crop[3]				height to clip a frame. Default is input height
	 *	
	 *	options.scale[0]			resize scale X. Default is 1
	 *	options.scale[1]			resize scale Y. Default is sx
	 *	
	 *	@param {ImageData} input
	 *	@param {Object} options		{ crop: [ cropX, cropY, cropWidth, cropHeight ], scale: [ scaleX, scaleY ] }
	 *	@return {GrayImageData}
	 */
	static From( input, options = {} ) {
		
		let width = input.width;
		let data = input.data;
		
		let [ cx, cy, cw, ch ] = options.crop || [ 0, 0, input.width, input.height ];
		let [ sx, sy ] = options.scale || [ 1, 1 ];
		
		/// output dimensions
		let ow = Math.floor( cw * sx ),
			oh = Math.floor( ch * sy );
		
		/// 
		let output = new GrayImageData( ow, oh );
		let outdata = output.data;
		
		for( let y = 0; y < oh; y++ ) {
			
			let offset_in = (cy + Math.floor(y/sy)) * width;
			let offset_out = y * ow;
			
			for( let x = 0; x < ow; x++ ) {
				
				let i = (offset_in + cx + Math.floor(x/sx)) * 4;
				let j = offset_out + x;
				
				/// BT.601-7
				/// @ref https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
				outdata[ j ] = Math.round( data[i] * 0.2989 + data[i+1] * 0.5870 + data[i+2] * 0.1140 );
				
			}
			
		}
		
		return output;
		
	}
	
	getImageData() {
		
		let indata = this.data;
		
		let output = new ImageData( this.width, this.height );
		let data = output.data;
		
		for( let i = 0; i < indata.length; i++ ) {
			
			let v = indata[ i ];
			
			let k = i * 4;
			
			data[ k   ] = v;
			data[ k+1 ] = v;
			data[ k+2 ] = v;
			data[ k+3 ] = 255;
			
		}
		
		return output;
		
	}
	
	toString( characters = "@." ) {
		
		let output = "";
		
		let step = 256/characters.length;
		
		let w = this.width,
			h = this.height;
			
		let data = this.data;
		
		for( let y = 0; y < h; y++ ) {
			
			let offset = y * w;
			
			for( let x = 0; x < w; x++ )
				output += characters.charAt( Math.floor( data[ offset+x ] / step ) );
			
			output += '\n';
				
		}
		
		return output;
		
	}
	
	/** fill
	 *	
	 *	@param {Number} bytes			8 bits
	 *	@return {GrayImageData}
	 */
	fill( bytes = 0x00000000 ) {
		
		this.data.fill( bytes );
		
		return this;
		
	}

	/** getLine
	 *	
	 *	@param {Number} xa
	 *	@param {Number} ya
	 *	@param {Number} xb
	 *	@param {Number} yb
	 *	@return {Uint8Array}
	 */
	getLine( xa, ya, xb, yb ) {
		
		let dx = xb - xa,
			dy = yb - ya;
		
		let length = Math.hypot( dx, dy );
		
		let width = this.width;
		let indata = this.data;
		
		let stepx = dx / length,
			stepy = dy / length;
			
		if( stepx == Infinity || stepx == -Infinity ) stepx = 0;
		if( stepy == Infinity || stepy == -Infinity ) stepy = 0;
		
		let output = new Uint8Array( length );
		
		for( let n = 0; n < length; n++ ) {
			
			let x = Math.round( xa + n * stepx ),
				y = Math.round( ya + n * stepy );
			
			output[ n ] = indata[ y * width + x ];
			
		}

		return output;

	}
	
	/** setLine 
	 *	
	 *	@param {Number} ax
	 *	@param {Number} ay
	 *	@param {Number} bx
	 *	@param {Number} by
	 *	@param {Number} or {Uint32Array} bytes
	 *	@return {ColorImageData}
	 */
	setLine( ax, ay, bx, by, bytes ) {
		
		const { width, height } = this;
		
		let indata = this.data;
		
		let dx = bx - ax,
			dy = by - ay;
		
		let length = Math.round( Math.hypot( dx, dy ) );
		
		let stepx = dx/length,
			stepy = dy/length;
		
		///
		if( !Number.isFinite( stepx ) ) stepx = 0;
		if( !Number.isFinite( stepy ) ) stepy = 0;
		
		/// check if `bytes` is iterable, like a Array or TypedArray
		if( typeof bytes[Symbol.iterator] == 'function' ) {
			
			let stepi = bytes.length/length;
			
			///
			for( let k = 0; k < length; k++ ) {
				
				let x = Math.round( ax + k * stepx ),
					y = Math.round( ay + k * stepy );
				
				if( outRange( x, 0, width ) || outRange( y, 0, height ) ) continue;
				
				indata[ y * width + x ] = bytes[ Math.floor( k * stepi ) ];
				
			}
			
		} else {
			
			///
			for( let k = 0; k < length; k++ ) {
				
				let x = Math.round( ax + k * stepx ),
					y = Math.round( ay + k * stepy );
				
				if( outRange( x, 0, width ) || outRange( y, 0, height ) ) continue;
				
				indata[ y * width + x ] = bytes;
				
			}

		}
		
		return this;
		
	}

	///
	///
	///
	
	/**	brightness
	 *	
	 *	@param {Number} s
	 *	@return {GrayImageData} this
	 */
	brightness( s ) {
		
		let data = this.data;
		
		for( let i = 0; i < data.length; i++ )
			data[ i ] = clamp( data[ i ] * s );
		
		return this;
		
	}
	
	/**	negative
	 *	
	 *	@return {GrayImageData} this
	 */
	negative() {
		
		let data = this.data;
		
		for( let i = 0; i < data.length; i++ )
			data[ i ] = 255 - data[ i ];
		
		return this;
		
	}
	
	/**	contrast
	 *	
	 *	@param {Number} c
	 *	@return {GrayImageData} this
	 */
	contrast( c ) {
		
		let data = this.data;
		
		let f = ( 259 * (c + 255) ) / (255 * (259 - c) );
		
		for( let i = 0; i < data.length; i++ )
			data[ i ] = clamp( f * (data[ i ] - 128) + 128 );
		
		return this;
		
	}
	
	
	/** threshold
	 *	
	 */
	threshold( value, min = 0, max = 255 ) {
		
		let data = this.data;
		
		///
		for( let i = 0; i < data.length; i++ )
			data[ i ] = data[ i ] > value? max : min;
		
		return this;
		
	}

	/** thresholdMean
	 *	
	 */
	thresholdMean( min = 0, max = 255, step = 5 ) {
		
		let data = this.data;
		
		let mean = 0;
		
		for( let i = 0; i < data.length; i += step )
			mean += data[ i ];
		
		mean = mean * step / data.length;
		
		for( let i = 0; i < data.length; i++ )
			data[ i ] = data[ i ] > mean? max : min;
		
		return this;
		
	}


	
	////
	////
	////
	
	/**	clone
	 *	
	 *	@return {GrayImageData} new
	 */
	clone() {
		
		return new GrayImageData( this.data, this.width, this.height );
		
	}
	
	/**	crop
	 *	
	 *	@param {Number} cx			x to clip a frame. Default is 0
	 *	@param {Number} cy			y to clip a frame. Default is 0
	 *	@param {Number} cw			width to clip a frame. Default is input width
	 *	@param {Number} ch			height to clip a frame. Default is input height
	 *	@return {RGBImage} new
	 */
	crop( sx, sy, sw, sh ) {
		
		let width = this.width;
		let indata = this.data;
		
		let output = new GrayImageData( sw, sh );
		let outdata = output.data;
		
		for( let y = 0; y < sh; y++ ) {
			
			let offset1 = (sy + y) * width;
			let offset2 = y * sw;
			
			for( let x = 0; x < sw; x++ ) {
				
				let i = offset1 + (sx + x);
				let j = offset2 + x;
				
				outdata[ j ] = indata[ i ];
			
			}
			
		}
		
		return output;
		
	}
	
	/**	resize
	 *	
	 *	@param {Number} sx			resize scale X. Default is 1
	 *	@param {Number} sy			resize scale Y. Default is sx
	 *	@return {RGBImage} new
	 */
	resize( scaleX, scaleY ) {
		
		let width = this.width;
		let indata = this.data;
		
		let w = Math.floor( width * scaleX ),
			h = Math.floor( this.height * scaleY );
			
		let output = new GrayImageData( w, h );
		let outdata = output.data;
		
		for( let y = 0; y < h; y++ ) {
			for( let x = 0; x < w; x++ ) {
				
				let i = width * Math.floor(y/scaleY) + Math.floor(x/scaleX);
				let j = w * y + x;
				
				outdata[ j ] = indata[ i ];
				
			}
		}
		
		return output;
	
	}
	
	/** blend
	 *	
	 *	@param {GrayImageData} input
	 *	@param {GrayImageData} new
	 */
	blend( input, as = .5, bs = .5 ) {
		
		if( !(input instanceof GrayImageData) )
			throw new Error("GrayImageData.blend: @param input is't a GrayImageData");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new GrayImageData( minw, minh );
		let outdata = output.data;
		
		let aw = this.width,
			bw = input.width;
		
		let adata = this.data;
		let bdata = input.data;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = (y * aw + x);
				let j = (y * bw + x);
				
				outdata[k] = clamp( adata[i] * as + bdata[j] * bs );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMin
	 *	
	 *	@param {GrayImageData} input
	 *	@param {GrayImageData} new
	 */
	blendMin( input ) {
		
		if( !(input instanceof GrayImageData) )
			throw new Error("GrayImageData.blendMin: @param input is't a GrayImageData");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new GrayImageData( minw, minh );
		let outdata = output.data;
		
		let aw = this.width,
			bw = input.width;
		
		let adata = this.data;
		let bdata = input.data;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = (y * aw + x);
				let j = (y * bw + x);
				
				outdata[k] = Math.min( adata[i], bdata[j] );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMax
	 *	
	 *	@param {GrayImageData} input
	 *	@param {GrayImageData} new
	 */
	blendMax( input ) {
		
		if( !(input instanceof GrayImageData) )
			throw new Error("GrayImageData.blendMax: @param input is't a GrayImageData");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new GrayImageData( minw, minh );
		let outdata = output.data;
		
		let aw = this.width,
			bw = input.width;
		
		let adata = this.data;
		let bdata = input.data;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = y * aw + x;
				let j = y * bw + x;
				
				outdata[k] = Math.max( adata[i], bdata[j] );
				
			}
		}
		
		return output;
		
	}
	
	/**	conv
	 *	
	 *	@param {Matrix} mask
	 *	@return {GrayImageData}
	 */
	conv( matrix ) {
		
		let { width, height, data } = this;
		
		let source = new Uint8Array( data );
		
		let w = width - 1, 
			h = height - 1;
		
		/// correção de intensidade
		let gamma = matrix.reduce((a,b)=>a+b);
		
		if( gamma <= 0 ) gamma = 1;

		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mhw = Math.floor( mw/2 );
		let mhh = Math.floor( mh/2 );
		
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {
				
				let vx = 0, vy = 0;
				
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						let xj = clamp((x+j) - mhw, 0, w),
							yi = clamp((y+i) - mhh, 0, h);
						
						let v = source[ yi * width + xj ];
						
						vx += v * matrix[ i*mw + j ];
						vy += v * matrix[ j*mw + i ];
						
					}
				}
				
				data[ y * width + x ] = clamp( Math.hypot( vx, vy )/gamma );
				
			}
		}
		
		return this;
		
	}
	
	///
	/// morphology
	///
	
	/**	dilate
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Erosion_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {GrayImageData} new
	 */
	dilate( matrix ) {
		
		let { width, height, data } = this;
		
		let source = new Uint8Array( data );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mhw = Math.floor( mw/2 );
		let mhh = Math.floor( mh/2 );
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let value = 0;
				
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						if( matrix[ i*mw + j ] == 1 ) {
						
							let xj = clamp((x+j) - mhw, 0, width-1),
								yi = clamp((y+i) - mhh, 0, height-1);
							
							let v = source[ yi * width + xj ] * matrix[ i*mw + j ];
							
							if( v > value ) value = v;
						
						}
						
					}
				}
				
				data[ y * width + x ] = value;
				
			}

		}

		return this;
		
	}
	
	/**	erode
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Dilation_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {GrayImageData} new
	 */
	erode( matrix ) {
		
		let { width, height, data } = this;
		
		let source = new Uint8Array( data );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mhw = Math.floor( mw/2 );
		let mhh = Math.floor( mh/2 );
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let value = 255;
				
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						if( matrix[ i*mw + j ] == 1 ) {
						
							let xj = clamp((x+j) - mhw, 0, width-1),
								yi = clamp((y+i) - mhh, 0, height-1);
							
							let v = source[ yi * width + xj ] * matrix[ i*mw + j ];
							
							if( v < value ) value = v;
						
						}
						
					}
				}
				
				data[ y * width + x ] = value;
				
			}

		}

		return this;
		
	}
	
	/**	open
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Opening_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {GrayImageData} new
	 */
	open( matrix ) {
		
		return this.erode( matrix ).dilate( matrix );
		
	}
	
	/**	close
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Closing_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {GrayImageData} new
	 */
	close( matrix ) {
		
		return this.dilate( matrix ).erode( matrix )
		
	}
	
	///
	///
	///
	
	clahe() {
		
		///
		let histogram = this.getHistogram();
		
		/// Calculating the CDF
		let cdf = calcCdf( histogram );
		
		///
		let data = this.data;
		
		///
		for( let i = 0; i < data.length; i++ )
			data[ i ] = cdf[ data[ i ] ];
		
		return this;
		
	
	}
	
	getHistogram( wx, wy, ww, wh ) {
		
		let width = this.width;
		let data = this.data;
		
		if( wx == undefined ) wx = 0;
		if( wy == undefined ) wy = 0;
		if( ww == undefined ) ww = width;
		if( wh == undefined ) wh = this.height;
		
		let output = new Object;
		
		let wmax = wx + ww;
		let hmax = wy + wh;
		
		for( let y = wy; y < hmax; y++ ) {
			
			let offset = y * width;
			
			for( let x = wx; x < wmax; x++ ) {
				
				let v = data[ offset + x ];
				
				if( !(v in output) ) output[ v ] = 0;
				
				output[ v ]++;
				
			}
		}
		
		return output;
		
	}
	
	/// 
	/// 
	/// 
	
	convOptimizer( matrix ) {
		
		let data = wasm.gray_conv( 
			this.data,
			this.width,
			this.height,
			matrix,
			matrix.width,
			matrix.height
		);
		
		this.data.set( data, 0 );
		
		return this;
		
	}
	
	erodeOptimizer( matrix ) {
		
		let data = wasm.gray_erode( 
			this.data,
			this.width,
			this.height,
			matrix,
			matrix.width,
			matrix.height
		);
		
		this.data.set( data, 0 );
		
		return this;
		
	}
	
	dilateOptimizer( matrix ) {
		
		let data = wasm.gray_dilate( 
			this.data,
			this.width,
			this.height,
			matrix,
			matrix.width,
			matrix.height
		);
		
		this.data.set( data, 0 );
		
		return this;
		
	}
	
	
	/** open
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	openOptimizer( matrix ) {
		
		let data = wasm.gray_open( 
			this.data,
			this.width,
			this.height,
			matrix,
			matrix.width,
			matrix.height
		);
		
		this.data.set( data, 0 );
		
		return this;
		
	}

	/** close
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	closeOptimizer( matrix ) {
		
		let data = wasm.gray_close( 
			this.data,
			this.width,
			this.height,
			matrix,
			matrix.width,
			matrix.height
		);
		
		this.data.set( data, 0 );
		
		return this;
		
	}

}
