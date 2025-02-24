
import { clamp, calcCdf, outRange } from './common/utils.mjs';


/** ColorImageData
 *	
 */
export default class ColorImageData extends ImageData {
	
	/** Extends
	 *	
	 *	Change prototype of a ImageData to has ColorImageData prototype
	 *	
	 *	@param {ImageData} target
	 */
	static Extends( target ) {
		
		if( !(target instanceof ImageData) )
				throw new Error('@param target is\'t a ImageData');
		
		Object.setPrototypeOf( target, ColorImageData.prototype );
		
	}
	
	///
	/// 
	///
	
	///  "Array Buffer Sharing" ou "View Aliasing"
	get data32() {
		
		if( this.bufferSharing )
			return this.bufferSharing;
		
		return this.bufferSharing = new Uint32Array( this.data.buffer );
		
	}
	
	/** clone
	 *	
	 *	@return {ColorImageData}
	 */
	clone() {
		
		let output = new ColorImageData( this.width, this.height );
		
		output.data.set( this.data, 0 );
		
		return output;
		
	}
	
	/** fill
	 *	
	 *	@param {Number} bytes			32 bits
	 *	@return {ColorImageData}
	 */
	fill( bytes = 0x00000000 ) {
		
		this.data32.fill( bytes );
		
		return this;
		
	}

	/** getLine
	 *	
	 *	@param {Number} ax
	 *	@param {Number} ay
	 *	@param {Number} bx
	 *	@param {Number} by
	 *	@return {Uint32Array} [ bytes0, bytes1, ... ] 
	 */
	getLine( ax, ay, bx, by ) {
		
		const { width, height } = this;
		const data = this.data32;
		
		let dx = bx - ax,
			dy = by - ay;
		
		let length = Math.hypot( dx, dy );
		
		let stepx = dx / length,
			stepy = dy / length;
		
		///
		if( !Number.isFinite( stepx ) ) stepx = 0;
		if( !Number.isFinite( stepy ) ) stepy = 0;
		
		///
		let output = new Uint32Array( length );
		
		for( let k = 0; k < length; k++ ) {
			
			let x = Math.round( ax + k * stepx ),
				y = Math.round( ay + k * stepy );
			
			if( outRange( x, 0, width ) || outRange( y, 0, height ) ) continue;
			
			let i = y * width + x;
			
			output[ k ] = data[ i ];
			
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
		const data = this.data32;
		
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
				
				let i = y * width + x;
				
				data[ i ] = bytes[ Math.floor( k * stepi ) ];
				
			}
			
		} else {
			
			///
			for( let k = 0; k < length; k++ ) {
				
				let x = Math.round( ax + k * stepx ),
					y = Math.round( ay + k * stepy );
				
				if( outRange( x, 0, width ) || outRange( y, 0, height ) ) continue;
				
				let i = y * width + x;
				
				data[ i ] = bytes;
				
			}

		}
		
		return this;
		
	}

	/** crop
	 *	
	 *	@param {Number} rx				rect x
	 *	@param {Number} ry				rect y
	 *	@param {Number} rw				rect width
	 *	@param {Number} rh				rect height
	 *	@return {ColorImageData}
	 */
	crop( rx, ry, rw, rh ) {
		
		let width = this.width;
		let inBuffer = this.data32
		
		let output = new ColorImageData( rw, rh );
		let outBuffer = output.data32;
		
		for( let y = 0; y < rh; y++ ) {
			
			let offset1 = (ry + y) * width;
			let offset2 = y * rw;
			
			for( let x = 0; x < rw; x++ ) {
				
				let i = offset1 + (rx + x);
				let j = offset2 + x;
				
				outBuffer[j] = inBuffer[i];
				
			}
			
		}
		
		return output;
		
	}

	/** resize
	 *	
	 *	@param {Number} sx
	 *	@param {Number} sy
	 *	@return {ColorImageData}
	 */
	resize( sx = 1, sy = 1 ) {
		
		///
		let { width, height } = this;
		
		///
		let w = Math.floor( width * sx ),
			h = Math.floor( height * sy );
			
		let inBuffer = this.data32;

		let output = new ColorImageData( w, h );
		let outBuffer = output.data32;
		
		for( let y = 0; y < h; y++ ) {
			
			/// offset input
			let offset_i = width * Math.floor(y/sy);
			
			/// offset output
			let offset_o = w * y;
			
			///
			for( let x = 0; x < w; x++ ) {
				
				let i = offset_i + Math.floor(x/sx);
				let j = offset_o + x;
				
				outBuffer[j] = inBuffer[i];
				
			}
		}
		
		return output;
		
	}
	
	///
	/// Basic Operations
	///
	
	/** grayScale
	 *	
	 *	@return {ColorImageData}
	 */
	grayScale() {
		
		let data = this.data;
		
		for( let i = 0; i < data.length; i += 4 ) {
			
			let v = clamp( data[i] * 0.2989 + data[i+1] * 0.5870 + data[i+2] * 0.1140 );
			
			data[ i   ] = v;
			data[ i+1 ] = v;
			data[ i+2 ] = v;

		}
		
		return this;
		
	}

	/**	brightness
	 *	
	 *	@param {Number} sr		red brightness scale
	 *	@param {Number} sg		green brightness scale
	 *	@param {Number} sb		blue brightness scale
	 *	@return {ColorImageData}
	 */
	brightness( sr = 1, sg = sr, sb = sg ) {
		
		let data = this.data;
		
		for( let i = 0; i < data.length; i += 4 ) {
			
			data[i  ] = clamp( data[i  ] * sr );
			data[i+1] = clamp( data[i+1] * sg );
			data[i+2] = clamp( data[i+2] * sb );
			
		}
		
		return this;
		
	}

	/**	negative
	 *	
	 *	@return {ColorImageData}
	 */
	negative() {
		
		let data = this.data;
		
		for( let i = 0; i < data.length; i += 4 ) {
			
			data[i  ] = 255 - data[i  ];
			data[i+1] = 255 - data[i+1];
			data[i+2] = 255 - data[i+2];
			
		}
	
		return this;
			
	}

	/**	contrast
	 *	
	 *	Contraste de Michelson
	 *		
	 *		C = (Imax - Imin) / (Imax - Imin)
	 *		
	 *		Imin: Menor intensidade de pixel na imagem
	 *		Imax: Maior intensidade de pixel na imagem
	 *		
	 *		
	 *	Contraste Global (Baseado no Desvio Padrão)
	 *	Contraste RMS (Root Mean Square)
	 *		
	 *		C = √((1/N)*Σ(I-u)^2)
	 *	
	 *		I: Intensidade do pixel (data[i])
	 *		u: Média das intensidades dos pixels.
	 *		N: Número total de pixels na imagem.
	 *	
	 *	@ref https://stackoverflow.com/questions/2976274/adjust-bitmap-image-brightness-contrast-using-c
	 *
	 *	@param {Number} value
	 *	@return {ColorImageData}
	 */
	contrast( value ) {
		
		let data = this.data;
		
		let f = (259 * (value + 255)) / (255 * (259 - value));
		
		for( let i = 0; i < data.length; i += 4 ) {
			
			data[i  ] = clamp( f * (data[i  ] - 128) + 128 );
			data[i+1] = clamp( f * (data[i+1] - 128) + 128 );
			data[i+2] = clamp( f * (data[i+2] - 128) + 128 );
			
		}
		
		return this;
		
	}

	/** threshold
	 *	
	 *	
	 *	@param {Number} value
	 *	@param {Number} min
	 *	@param {Number} max
	 *	@return {ColorImageData}
	 */
	threshold( value, min = 0, max = 255 ) {
		
		let data = this.data;
		
		///
		for( let i = 0; i < data.length; i += 4 ) {
			
			data[ i   ] = data[ i   ] > value? max : min;
			data[ i+1 ] = data[ i+1 ] > value? max : min;
			data[ i+2 ] = data[ i+2 ] > value? max : min;
			
		}

		return this;
		
	}

	/** thresholdMean
	 *	
	 *	@param {Number} stepper
	 *	@param {Number} min
	 *	@param {Number} max
	 *	@return {ColorImageData}
	 */
	thresholdMean( stepper = 5, min = 0, max = 255 ) {
		
		let data = this.data;
		
		let length = data.length;
		let size = length/4;
		
		let meanR = 0;
		let meanG = 0;
		let meanB = 0;
		
		let step = 4*stepper;
		
		for( let i = 0; i < length; i += step ) {
			
			meanR += data[ i   ];
			meanG += data[ i+1 ];
			meanB += data[ i+2 ];
		
		}
		
		let quantity = stepper/size;
		
		meanR = meanR*quantity;
		meanG = meanG*quantity;
		meanB = meanB*quantity;
		
		for( let i = 0; i < length; i += 4 ) {

			data[ i   ] = data[ i   ] > meanR? max : min;
			data[ i+1 ] = data[ i+1 ] > meanG? max : min;
			data[ i+2 ] = data[ i+2 ] > meanB? max : min;

		}
		
		return this;
		
	}
	
	///
	/// Blend
	///
	
	/** blend
	 *	
	 *	@param {ColorImageData} input
	 *	@param {Number} as			brightness for A image (this)
	 *	@param {Number} bs			brightness for B image (input)
	 *	@return {ColorImageData}
	 */
	blend( input, as = .5, bs = .5 ) {
		
		///
		let aw = this.width,
			bw = input.width;
		
		///
		let minw = Math.min( aw, bw );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new Uint8ClampedArray( 4 * minw * minh );
		
		let dataA = this.data;
		let dataB = input.data;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			let oa = y * aw;
			let ob = y * bw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 4;
				
				let i = (oa + x) * 4;
				let j = (ob + x) * 4;
				
				output[k  ] = clamp( dataA[i  ] * as + dataB[j  ] * bs );
				output[k+1] = clamp( dataA[i+1] * as + dataB[j+1] * bs );
				output[k+2] = clamp( dataA[i+2] * as + dataB[j+2] * bs );
				output[k+3] = 255;
				
			}
		}
		
		return new ColorImageData( output, minw, minh );
		
	}

	/** blendMin
	 *	
	 *	@param {ColorImageData} input
	 *	@return {ColorImageData}
	 */
	blendMin( input ) {
		
		///
		let aw = this.width,
			bw = input.width;
		
		///
		let minw = Math.min( aw, bw );
		let minh = Math.min( inputA.height, input.height );
		
		///
		let output = new Uint8ClampedArray( 4 * minw * minh );
		
		let dataA = this.data;
		let dataB = input.data;
		
		///
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			let oa = y * aw;
			let ob = y * bw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 4;
				
				let i = (oa + x) * 4;
				let j = (ob + x) * 4;
				
				output[k  ] = Math.min( dataA[i  ], dataB[j  ] );
				output[k+1] = Math.min( dataA[i+1], dataB[j+1] );
				output[k+2] = Math.min( dataA[i+2], dataB[j+2] );
				output[k+3] = 255;
				
			}
		}
		
		return new ColorImageData( output, minw, minh );
		
	}

	/** blendMax
	 *	
	 *	@param {ColorImageData} input
	 *	@return {ColorImageData}
	 */
	blendMax( input ) {
		
		///
		let aw = this.width,
			bw = input.width;
		
		///
		let minw = Math.min( aw, bw );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new Uint8ClampedArray( 4 * minw * minh );
		
		let dataA = this.data;
		let dataB = input.data;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			let oa = y * aw;
			let ob = y * bw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 3;
				
				let i = (oa + x) * 3;
				let j = (ob + x) * 3;
				
				output[k  ] = Math.max( dataA[i  ], dataB[j  ] );
				output[k+1] = Math.max( dataA[i+1], dataB[j+1] );
				output[k+2] = Math.max( dataA[i+2], dataB[j+2] );
				output[k+3] = 255;
				
			}
		}
		
		return new ColorImageData( output, minw, minh );
		
	}
	
	///
	/// Concolution
	///
	
	/** conv
	 *	
	 *	Operação de convolução utilizando os 3 canais de uma imagem.
	 *	
	 *	@param {Matrix} matrix		a square matrix
	 *	@return {ColorImageData}
	 */
	conv( matrix ) {
		
	//	console.log( matrix.toString() )
		
		let { width, height, data } = this;
		
		let source = new Uint8ClampedArray( data );
		
		///
		let mw = matrix.width,
			mh = matrix.height;
		
		let mwh = Math.floor( mw / 2 ),
			mhh = Math.floor( mh / 2 );
		
		///
		let w = width - 1, 
			h = height - 1;
		
		/// a matriz de entrada pode exceder o range [0,255] nas operações
		/// para normalizar o resultado, dividimos pela escala
		let s = Math.abs(matrix.reduce(function( a, b ) { return a + b })) || 1;
		
		///
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {

				let rx = 0, ry = 0,
					gx = 0, gy = 0,
					bx = 0, by = 0;
				
				for( let i = 0; i < mh; i++ ) {
					for( let j = 0; j < mw; j++ ) {
						
						let mx = matrix[ j*mw + i ],
							my = matrix[ i*mw + j ];
						
						let io = i - mhh,
							jo = j - mwh;
						
						let xj = clamp( x + jo, 0, w ), 
							yi = clamp( y + io, 0, h );
						
						///
						let n = 4 * (yi * width + xj);
						
						let r = source[ n++ ],
							g = source[ n++ ],
							b = source[ n   ];

						rx += r * mx;
						ry += r * my;
						
						gx += g * mx;
						gy += g * my;
						
						bx += b * mx;
						by += b * my;

					}
				}
				
				///
				let offset = 4 * (y * width + x);
				
				data[ offset++ ] = clamp( Math.hypot( rx, ry )/s );
				data[ offset++ ] = clamp( Math.hypot( gx, gy )/s );
				data[ offset++ ] = clamp( Math.hypot( bx, by )/s );
				data[ offset++ ] = 255;
				
			}
		}
		
		return this;
		
	}

	///
	/// Morphology
	///
	
	/** dilate
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	dilate( matrix ) {
			
		let { data, width, height } = this;
		
		let source = new Uint8ClampedArray( data );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mw2 = Math.floor( mw / 2 );
		let mh2 = Math.floor( mh / 2 );
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let vr = 0;
				let vg = 0;
				let vb = 0;

				for( let i = -mh2; i < mh2; i++ ) {
					for( let j = -mw2; j < mw2; j++ ) {
						
						let n = 4 * ( width*( y + i ) + x + j );
						
						if( source[n  ] > vr ) vr = source[n  ];
						if( source[n+1] > vg ) vg = source[n+1];
						if( source[n+2] > vb ) vb = source[n+2];
						
					}
				}
				
				let index = (offset_row + x) * 4;
				
				data[ index   ] = vr;
				data[ index+1 ] = vg;
				data[ index+2 ] = vb;
				
			}

		}
		
		return this;
		
	}

	/** erode
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	erode( matrix ) {
		
		let { data, width, height } = this;
		
		let source = new Uint8ClampedArray( data );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mw2 = Math.floor( mw / 2 );
		let mh2 = Math.floor( mh / 2 );
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let vr = 255;
				let vg = 255;
				let vb = 255;

				for( let i = -mh2; i < mh2; i++ ) {
					for( let j = -mw2; j < mw2; j++ ) {
						
						let n = 4 * ( width*( y + i ) + x + j );

						if( source[n  ] < vr ) vr = source[n  ];
						if( source[n+1] < vg ) vg = source[n+1];
						if( source[n+2] < vb ) vb = source[n+2];
						
					}
				}
				
				let index = (offset_row + x) * 4;
				
				data[ index   ] = vr;
				data[ index+1 ] = vg;
				data[ index+2 ] = vb;
				
			}

		}
		
		return this;
		
	}
		
	/** open
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	open( matrix ) {
		
		return this.erode( matrix ).dilate( matrix );
		
	}

	/** close
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ColorImageData}
	 */
	close( matrix ) {
		
		return this.dilate( matrix ).erode( matrix );
		
	}

	///
	/// CLAHE
	///
	
	/** getHistogram
	 *	
	 *	@param {Number} wx, wy, ww, wh		window rect
	 *	@return {Array}						[ red, green, blue ]
	 */
	getHistogram( wx, wy, ww, wh ) {
			
		let width = this.width;
		
		if( !wx ) wx = 0;
		if( !wy ) wy = 0;
		if( !ww ) ww = width;
		if( !wh ) wh = this.height;
		
		let red = new Object;
		let green = new Object;
		let blue = new Object;
		
		let data = this.data;
		
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
		
		return [ red, green, blue ];
		
	}

	/** clahe
	 *	
	 *	@return {ColorImageData}
	 */
	clahe() {
		
		let { data } = this;
		
		let [ channelR, channelG, channelB ] = this.getHistogram();
		
		/// Calculating the CDF
		channelR = calcCdf( channelR );
		channelG = calcCdf( channelG );
		channelB = calcCdf( channelB );
		
		///
		for( let i = 0; i < data.length; i+=4 ) {
			
			data[ i   ] = channelR[ data[ i   ] ];
			data[ i+1 ] = channelG[ data[ i+1 ] ];
			data[ i+2 ] = channelB[ data[ i+2 ] ];
			
		}
		
		return this;
		
	}

	
}

