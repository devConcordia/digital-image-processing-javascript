
import { clamp, clahe_cdf } from "./common.mjs";

/** ImageGray
 *	
 */
export default class ImageGray extends Uint8Array {
	
	constructor( w, h, data = null ) {
		
		if( data == null ) data = w * h;
		
		super( data );
		
		this.width = w;
		this.height = h;
		
	}
	
	/** FromImageData
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
	 *	@return {ImageGray}
	 */
	static FromImageData( input, options = {} ) {
		
		let width = input.width;
		let data = input.data;
		
		let [ cx, cy, cw, ch ] = options.crop || [ 0, 0, input.width, input.height ];
		let [ sx, sy ] = options.scale || [ 1, 1 ];
		
		/// output dimensions
		let ow = Math.floor( cw * sx ),
			oh = Math.floor( ch * sy );
		
		/// 
		let output = new ImageGray( ow, oh );
		
		for( let y = 0; y < oh; y++ ) {
			
			var offset_in = (cy + Math.floor(y/sy)) * width;
			var offset_out = y * ow;
			
			for( var x = 0; x < ow; x++ ) {
				
				var i = (offset_in + cx + Math.floor(x/sx)) * 4;
				var j = offset_out + x;
				
				/// BT.601-7
				/// @ref https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
				output[ j ] = Math.round( data[i] * 0.2989 + data[i+1] * 0.5870 + data[i+2] * 0.1140 );
				
			}
			
		}
		
		return output;
		
	}
	
	/** FromImageRGB
	 *	
	 *	@param {ImageRGB} input
	 *	@return {ImageGray}
	 */
	static FromImageRGB( input ) {
		
		let output = new ImageGray( input.width, input.height );
		
		for( let i = 0; i < input.length; i += 3 ) {
			
			/// BT.601-7
			/// @ref https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
			output[ i/3 ] = Math.round( input[i] * 0.2989 + input[i+1] * 0.5870 + input[i+2] * 0.1140 );
		
		}
		
		return output;

	}
	
	getImageData() {
		
		let output = new ImageData( this.width, this.height );
		let data = output.data;
		
		for( let i = 0; i < this.length; i++ ) {
			
			let k = i * 4;
			let v = this[ i ];
			
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
			
		for( let y = 0; y < h; y++ ) {
			
			let offset = y * w;
			
			for( let x = 0; x < w; x++ )
				output += characters.charAt( Math.floor( this[ offset+x ] / step ) );
			
			output += '\n';
				
		}
		
		return output;
		
	}
	
	////
	////
	////
	
	/** get
	 *	
	 *	@param {Number} x
	 *	@param {Number} y
	 *	@return {Number}		0 < value < 255
	 */
	get( x, y ) {
		
		return this[ y * this.width + x ]
		
	}
	
	/** set
	 *	
	 *	@param {Number} x
	 *	@param {Number} y
	 *	@param {Number} value		0 < value < 255
	 */
	set( x, y, v ) {
		
		this[ y * this.width + x ] = v;
		
	}
	
	/** getLine
	 *	
	 *	@param {Number} x0
	 *	@param {Number} y0
	 *	@param {Number} x1
	 *	@param {Number} y1
	 *	@return {Uint8Array}
	 */
	getLine( x0, y0, x1, y1 ) {
		
		var dx = x1 - x0,
			dy = y1 - y0;
		
		var length = Math.hypot( dx, dy );
		
		var width = this.width;
		
		var stepx = dx / length,
			stepy = dy / length;
			
		if( stepx == Infinity || stepx == -Infinity ) stepx = 0;
		if( stepy == Infinity || stepy == -Infinity ) stepy = 0;
		
		var output = new Uint8Array( length );
		
		for( var n = 0; n < length; n++ ) {
			
			var x = Math.round( x0 + n * stepx ),
				y = Math.round( y0 + n * stepy );
			
			output[ n ] = this[ y * width + x ];
			
		}

		return output;

	}
	
	/** setLine
	 *	
	 *	@param {Number} x0
	 *	@param {Number} y0
	 *	@param {Number} x1
	 *	@param {Number} y1
	 *	@param {Number} value		0 < value < 255
	 */
	setLine( x0, y0, x1, y1, value ) {
		
		var width = this.width;
		
		var dx = x1 - x0,
			dy = y1 - y0;
		
		var length = Math.round( Math.hypot( dx, dy ) );
		
		var stepx = dx / length,
			stepy = dy / length;
			
		if( stepx == Infinity || stepx == -Infinity ) stepx = 0;
		if( stepy == Infinity || stepy == -Infinity ) stepy = 0;
		
		for( var n = 0; n < length; n++ ) {
			
			var x = Math.round( x0 + n * stepx ),
				y = Math.round( y0 + n * stepy );
			
			this[ y * width + x ] = value;
			
		}

		return this;

	}
	
	///
	///
	///
	
	/** clear
	 *	
	 *	@param {Number} value			0 < value < 255
	 *	@return {ImageGray} this
	 */
	clear( value = 0 ) {
		
		this.fill( value );
		
		return this;
		
	}
	
	/**	brightness
	 *	
	 *	@param {Number} s
	 *	@return {ImageGray} this
	 */
	brightness( s ) {
		
		for( let i = 0; i < this.length; i++ )
			this[ i ] = clamp( this[ i ] * s );
		
		return this;
		
	}
	
	/**	negative
	 *	
	 *	@return {ImageGray} this
	 */
	negative() {
		
		for( let i = 0; i < this.length; i++ )
			this[ i ] = 255 - this[ i ];
		
		return this;
		
	}
	
	/**	contrast
	 *	
	 *	@param {Number} c
	 *	@return {ImageGray} this
	 */
	contrast( c ) {
		
		let f = ( 259 * (c + 255) ) / (255 * (259 - c) );
		
		for( let i = 0; i < this.length; i++ )
			this[ i ] = clamp( f * (this[ i ] - 128) + 128 );
		
		return this;
		
	}
	
	////
	////
	////
	
	/**	clone
	 *	
	 *	@return {ImageGray} new
	 */
	clone() {
		
		return new ImageGray( this.width, this.height, this );
		
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
		
		let output = new ImageGray( sw, sh );
		
		for( let y = 0; y < sh; y++ ) {
			
			let offset1 = (sy + y) * width;
			let offset2 = y * sw;
			
			for( let x = 0; x < sw; x++ ) {
				
				let i = offset1 + (sx + x);
				let j = offset2 + x;
				
				output[ j ] = this[ i ];
			
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
		
		let w = Math.floor( width * scaleX ),
			h = Math.floor( this.height * scaleY );
			
		let output = new ImageGray( w, h );
		
		for( let y = 0; y < h; y++ ) {
			for( let x = 0; x < w; x++ ) {
				
				let i = width * Math.floor(y/scaleY) + Math.floor(x/scaleX);
				let j = w * y + x;
				
				output[ j ] = this[ i ];
				
			}
		}
		
		return output;
	
	}
	
	/** blend
	 *	
	 *	@param {ImageGray} input
	 *	@param {ImageGray} new
	 */
	blend( input, as = .5, bs = .5 ) {
		
		if( !(input instanceof ImageGray) )
			throw new Error("ImageGray.blend: @param input is't a ImageGray");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageGray( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = (y * aw + x);
				let j = (y * bw + x);
				
				output[k] = clamp( this[i] * as + input[j] * bs );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMin
	 *	
	 *	@param {ImageGray} input
	 *	@param {ImageGray} new
	 */
	blendMin( input ) {
		
		if( !(input instanceof ImageGray) )
			throw new Error("ImageGray.blendMin: @param input is't a ImageGray");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageGray( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = (y * aw + x);
				let j = (y * bw + x);
				
				output[k] = Math.min( this[i], input[j] );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMax
	 *	
	 *	@param {ImageGray} input
	 *	@param {ImageGray} new
	 */
	blendMax( input ) {
		
		if( !(input instanceof ImageGray) )
			throw new Error("ImageGray.blendMax: @param input is't a ImageGray");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageGray( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x);
				
				let i = y * aw + x;
				let j = y * bw + x;
				
				output[k] = Math.max( this[i], input[j] );
				
			}
		}
		
		return output;
		
	}
	
	/**	conv
	 *	
	 *	@param {Matrix} mask
	 *	@return {ImageGray} new
	 */
	conv( matrix ) {
		
		let { width, height } = this;
		
		let output = new ImageGray( width, height );
		
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
						
					//	let xj = clamp(x+j, 0, w), 
					//		yi = clamp(y+i, 0, h);
						
						let xj = clamp((x+j) - mhw, 0, w),
							yi = clamp((y+i) - mhh, 0, h);
						
						let v = this[ yi * width + xj ];
						
						vx += v * matrix[ i*mw + j ];
						vy += v * matrix[ j*mw + i ];
						
					}
				}
				
				output[ y * width + x ] = clamp( Math.hypot( vx, vy )/gamma );
				
			}
		}
		
		return output;
		
	}
	
	///
	/// morphology
	///
	
	/**	dilate
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Erosion_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageGray} new
	 */
	dilate( matrix ) {
		
		let { width, height } = this;
		
		let output = new ImageGray( width, height );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mhw = Math.floor( mw/2 );
		let mhh = Math.floor( mh/2 );
		
		for( var y = 0; y < height; y++ ) {
			
			var offset_row = y * width;
			
			for( var x = 0; x < width; x++ ) {

				var value = 0;
				
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						if( matrix[ i*mw + j ] === 0 ) continue;
						
					//	let xj = clamp((x+j) - mhw, 0, width),
					//		yi = clamp((y+i) - mhh, 0, height);
						
						let xj = clamp((x+j) - mhw, 0, width-1),
							yi = clamp((y+i) - mhh, 0, height-1);
						
						let v = this[ yi * width + xj ];
					//	let v = this[ yi * width + xj ] * matrix[ i*mw + j ];
						
						if( v > value ) value = v;
						
					}
				}
				
				output[ y * width + x ] = value;
				
			}

		}

		return output;
		
	}
	
	/**	erode
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Dilation_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageGray} new
	 */
	erode( matrix ) {
		
		let { width, height } = this;
		
		let output = new ImageGray( width, height );
		
		let mw = matrix.width;
		let mh = matrix.height;
		
		let mhw = Math.floor( mw/2 );
		let mhh = Math.floor( mh/2 );
		
		for( var y = 0; y < height; y++ ) {
			
			var offset_row = y * width;
			
			for( var x = 0; x < width; x++ ) {

				var value = 255;
				
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						if( matrix[ i*mw + j ] === 0 ) continue;
						
					//	let xj = clamp((x+j) - mhw, 0, width),
					//		yi = clamp((y+i) - mhh, 0, height);
						
						let xj = clamp((x+j) - mhw, 0, width-1),
							yi = clamp((y+i) - mhh, 0, height-1);
						
						let v = this[ yi * width + xj ];
					//	let v = this[ yi * width + xj ] * matrix[ i*mw + j ];
						
						if( v < value ) value = v;
						
					}
				}
				
				output[ y * width + x ] = value;
				
			}

		}

		return output;
		
	}
	
	/**	open
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Opening_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageGray} new
	 */
	open( matrix ) {
		
		return this.erode( matrix ).dilate( matrix );
		
	}
	
	/**	close
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Closing_(morphology)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageGray} new
	 */
	close( matrix ) {
		
		return this.dilate( matrix ).erode( matrix )
		
	}
	
	/**	hitOrMiss
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageGray} new
	 */
	hitOrMiss( matrix ) {
		
		return this.open( matrix ).close( matrix );
		
	}
	
	///
	///
	///
	
	clahe() {
		
		/// equalized_image
		let output = new ImageGray( this.width, this.height );
		
		///
		let histogram = this.histogram();
		
		/// Calculating the CDF
		let cdf = clahe_cdf( histogram );
		
		///
		for( let i = 0; i < this.length; i++ )
			output[ i ] = cdf[ this[ i ] ];
		
		return output;
		
	
	}
	
	histogram( wx, wy, ww, wh ) {
		
		let width = this.width;
		
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
				
				let v = this[ offset + x ];
				
				if( !(v in output) ) output[ v ] = 0;
				
				output[ v ]++;
				
			}
		}
		
		return output;
		
	}
	
}
