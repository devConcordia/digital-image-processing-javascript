
import { clamp, clahe_cdf } from "./common.mjs";

/** ImageRGB
 *	
 */
export default class ImageRGB extends Uint8Array {
	
	/** 
	 *	
	 *	@param {Number} w			width
	 *	@param {Number} h			height
	 *	@param {TypedArray} data	
	 */
	constructor( w, h, data = null ) {
		
		if( data == null ) data = 3 * w * h;
		
		super( data );
		
		this.width = w;
		this.height = h;
		
	}
	
	/** FromImageData
	 *	
	 *	options:
	 *		cropX 			x to clip a frame. Default is 0
	 *		cropY           y to clip a frame. Default is 0
	 *		cropWidth       width to clip a frame. Default is input width
	 *		cropHeight      height to clip a frame. Default is input height
	 *		
	 *		scaleX			resize scale X. Default is 1
	 *		scaleY			resize scale Y. Default is 1
	 *	
	 *	@param {ImageData} input
	 *	@param {Object} options		{ crop: [ cropX, cropY, cropWidth, cropHeight ], scale: [ scaleX, scaleY ] }
	 *	@return {ImageRGB}
	 */
	static FromImageData( input, options = {}) {
		
		let width = input.width;
		let data = input.data;
		
		let [ cx, cy, cw, ch ] = options.crop || [ 0, 0, input.width, input.height ];
		let [ sx, sy ] = options.scale || [ 1, 1 ];
		
		/// output dimensions
		let ow = Math.floor( cw * sx ),
			oh = Math.floor( ch * sy );
		
		/// 
		let output = new ImageRGB( ow, oh );
		
		for( let y = 0; y < oh; y++ ) {
			
			var offset_in = (cy + Math.floor(y/sy)) * width;
			var offset_out = y * ow;
			
			for( var x = 0; x < ow; x++ ) {
				
				var i = (offset_in + cx + Math.floor(x/sx)) * 4;
				
				/// ImageRGB have only 3 channel (RGB)
				var j = (offset_out + x) * 3;
				
				output[ j   ] = data[ i   ];
				output[ j+1 ] = data[ i+1 ];
				output[ j+2 ] = data[ i+2 ];
			
			}
			
		}
		
		return output;
		
	}
	
	/**	getImageData
	 *	
	 *	@return {ImageData}
	 */
	getImageData() {
		
		let output = new ImageData( this.width, this.height );
		let data = output.data;
		
		for( let i = 0; i < this.length; i += 3 ) {
			
			let k = Math.floor((i/3) * 4);
			
			data[ k++ ] = this[ i   ];
			data[ k++ ] = this[ i+1 ];
			data[ k++ ] = this[ i+2 ];
			data[ k++ ] = 255;
			
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
	 *	@return {Array}
	 */
	get( x, y ) {
		
		let i = (y * this.width + x) * 3;
		
		return [
			this[ i   ],
			this[ i+1 ],
			this[ i+2 ]
		];
		
	}
	
	/** set
	 *	
	 *	@param {Number} x
	 *	@param {Number} y
	 *	@param {Number} value		hexdecimal color	0xRRGGBB
	 */
	set( x, y, value ) {
		
		let i = (y * this.width + x) * 3;
		
		var vr = value >> 16 & 0xff;
		var vg = value >> 8 & 0xff;
		var vb = value & 0xff;
		
		this[ i   ] = vr;
		this[ i+1 ] = vg;
		this[ i+2 ] = vb;
		
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
		
		var output = new Uint8Array( length * 3 );
		
		for( var n = 0; n < length; n++ ) {
			
			var x = Math.round( x0 + n * stepx ),
				y = Math.round( y0 + n * stepy );
			
			var i = (y * width + x) * 3;
			
			var k = n * 3;
			
			output[ k   ] = this[ i   ];
			output[ k+1 ] = this[ i+1 ];
			output[ k+2 ] = this[ i+2 ];
			
		}

		return output;

	}
	
	/** setLine
	 *	
	 *	@param {Number} x0
	 *	@param {Number} y0
	 *	@param {Number} x1
	 *	@param {Number} y1
	 *	@param {Number} value		hexdecimal color	0xRRGGBB
	 */
	setLine( x0, y0, x1, y1, value ) {
		
		var vr = value >> 16 & 0xff;
		var vg = value >> 8 & 0xff;
		var vb = value & 0xff;
		
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
			
			var i = (y * width + x) * 3;
			
			this[ i   ] = vr;
			this[ i+1 ] = vg;
			this[ i+2 ] = vb;
			
		}

		return this;

	}
	
	////
	////
	////
	
	/** 
	 *	
	 *	@param {Number} vr
	 *	@param {Number} vg
	 *	@param {Number} vb
	 *	@return {ImageRGB} this
	 */
	clear( vr = 0, vg = 0, vb = 0 ) {
		
		for( let i = 0; i < this.length; i += 3 ) {
			
			this[i  ] = vr;
			this[i+1] = vg;
			this[i+2] = vb;
			
		}
		
		return this;
		
	}
	
	/**	brightness
	 *	
	 *	@param {Number} sr		red brightness scale
	 *	@param {Number} sg		green brightness scale
	 *	@param {Number} sb		blue brightness scale
	 *	@return {ImageRGB} this
	 */
	brightness( sr = 1, sg, sb ) {
		
		if( !sg ) sg = sr;
		if( !sb ) sb = sr;
		
		for( let i = 0; i < this.length; i += 3 ) {
			
			this[i  ] = clamp( this[i  ] * sr );
			this[i+1] = clamp( this[i+1] * sg );
			this[i+2] = clamp( this[i+2] * sb );
			
		}
		
		return this;
		
	}
	
	/**	negative
	 *	
	 *	@return {ImageRGB} this
	 */
	negative() {
		
		for( let i = 0; i < this.length; i += 3 ) {
			
			this[i  ] = 255 - this[i  ];
			this[i+1] = 255 - this[i+1];
			this[i+2] = 255 - this[i+2];
			
		}
		
		return this;
		
	}
	
	/**	contrast
	 *	
	 *	@ref https://stackoverflow.com/questions/2976274/adjust-bitmap-image-brightness-contrast-using-c
	 *
	 *	@param {Number} c
	 *	@return {ImageRGB} this
	 */
	contrast( c ) {
		
		let f = ( 259 * (c + 255) ) / (255 * (259 - c) );
		
		for( let i = 0; i < this.length; i += 3 ) {
			
			this[i  ] = clamp( f * (this[i  ] - 128) + 128 );
			this[i+1] = clamp( f * (this[i+1] - 128) + 128 );
			this[i+2] = clamp( f * (this[i+2] - 128) + 128 );
			
		}
		
		return this;
		
	}
	
	////
	////
	////
	
	/**	clone
	 *	
	 *	@return {ImageRGB} new
	 */
	clone() {
		
		return new ImageRGB( this.width, this.height, this );
		
	}
	
	/**	crop
	 *	
	 *	
	 *	@param {Number} cx			x to clip a frame. Default is 0
	 *	@param {Number} cy			y to clip a frame. Default is 0
	 *	@param {Number} cw			width to clip a frame. Default is input width
	 *	@param {Number} ch			height to clip a frame. Default is input height
	 *	@return {ImageRGB}  new
	 */
	crop( cx, cy, cw, ch ) {
		
		let width = this.width;
		
		let output = new ImageRGB( cw, ch );
		
		for( let y = 0; y < ch; y++ ) {
			
			let offset_in = (cy + y) * width;
			let offset_out = y * cw;
			
			for( let x = 0; x < cw; x++ ) {
				
				let i = (offset_in + (cx + x)) * 3;
				let j = (offset_out + x) * 3;
				
				output[ j   ] = this[ i   ];
				output[ j+1 ] = this[ i+1 ];
				output[ j+2 ] = this[ i+2 ];
			
			}
			
		}
		
		return output;
		
	}
	
	/**	resize
	 *	
	 *	@param {Number} sx			resize scale X. Default is 1
	 *	@param {Number} sy			resize scale Y. Default is sx
	 *	@return {ImageRGB} new
	 */
	resize( sx = 1, sy = 0 ) {
		
		if( !sy ) sy = sx;
		
		let width = this.width;
		
		let w = Math.floor( width * sx ),
			h = Math.floor( this.height * sy );
			
		let output = new ImageRGB( w, h );
		
		for( let y = 0; y < h; y++ ) {
			
			let offset_in = width * Math.floor(y/sy);
			let offset_out = w * y;
			
			for( let x = 0; x < w; x++ ) {
				
				let i = (offset_in + Math.floor(x/sx)) * 3;
				let j = (offset_out + x) * 3;
				
				output[ j   ] = this[ i   ];
				output[ j+1 ] = this[ i+1 ];
				output[ j+2 ] = this[ i+2 ];
				
			}
		}
		
		return output;
	
	}
	
	/** blend
	 *	
	 *	@param {ImageRGB} input
	 *	@param {Number} as			brightness for A image (this)
	 *	@param {Number} bs			brightness for B image (input)
	 *	@param {ImageRGB} new
	 */
	blend( input, as = .5, bs = .5 ) {
		
		if( !(input instanceof ImageRGB) )
			throw new Error("ImageRGB.blend: @param input is't a ImageRGB");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageRGB( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 3;
				
				let i = (y * aw + x) * 3;
				let j = (y * bw + x) * 3;
				
				output[k  ] = clamp( this[i  ] * as + input[j  ] * bs );
				output[k+1] = clamp( this[i+1] * as + input[j+1] * bs );
				output[k+2] = clamp( this[i+2] * as + input[j+2] * bs );
				
			//	output[k  ] = clamp( Math.abs(this[i  ] * as + input[j  ] * bs) );
			//	output[k+1] = clamp( Math.abs(this[i+1] * as + input[j+1] * bs) );
			//	output[k+2] = clamp( Math.abs(this[i+2] * as + input[j+2] * bs) );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMin
	 *	
	 *	@param {ImageRGB} input
	 *	@param {ImageRGB} new
	 */
	blendMin( input ) {
		
		if( !(input instanceof ImageRGB) )
			throw new Error("ImageRGB.blendMin: @param input is't a ImageRGB");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageRGB( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 3;
				
				let i = (y * aw + x) * 3;
				let j = (y * bw + x) * 3;
				
				output[k  ] = Math.min( this[i  ], input[j  ] );
				output[k+1] = Math.min( this[i+1], input[j+1] );
				output[k+2] = Math.min( this[i+2], input[j+2] );
				
			}
		}
		
		return output;
		
	}
	
	/** blendMax
	 *	
	 *	@param {ImageRGB} input
	 *	@param {ImageRGB} new
	 */
	blendMax( input ) {
		
		if( !(input instanceof ImageRGB) )
			throw new Error("ImageRGB.blendMax: @param input is't a ImageRGB");
		
		///
		let minw = Math.min( this.width, input.width );
		let minh = Math.min( this.height, input.height );
		
		///
		let output = new ImageRGB( minw, minh );
		
		let aw = this.width,
			bw = input.width;
		
		for( let y = 0; y < minh; y++ ) {
			
			let offset = y * minw;
			
			for( let x = 0; x < minw; x++ ) {
				
				let k = (offset + x) * 3;
				
				let i = (y * aw + x) * 3;
				let j = (y * bw + x) * 3;
				
				output[k  ] = Math.max( this[i  ], input[j  ] );
				output[k+1] = Math.max( this[i+1], input[j+1] );
				output[k+2] = Math.max( this[i+2], input[j+2] );
				
			}
		}
		
		return output;
		
	}
	
	/**	conv
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Kernel_(image_processing)
	 *	
	 *	@param {Matrix} matrix
	 *	@return {ImageRGB} new
	 */
	conv( matrix ) {
		
		let { width, height } = this;
		
		let output = new ImageRGB( width, height );
		
		let w = width - 1, 
			h = height - 1;
		
		let gamma = matrix.reduce((a,b)=>a+b);
		
		if( gamma <= 0 ) gamma = 1;
		
		let mw = matrix.width;
		
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {

				let rx = 0, ry = 0;
				let gx = 0, gy = 0;
				let bx = 0, by = 0;
	
				for( let i = 0; i < matrix.height; i++ ) {
					for( let j = 0; j < matrix.width; j++ ) {
						
						let xj = clamp(x+j, 0, w), 
							yi = clamp(y+i, 0, h);
					
						let n = (yi * width + xj) * 3;
						
						let r = this[ n++ ];
						let g = this[ n++ ];
						let b = this[ n++ ];
						
						let m0 = matrix[ i*mw + j ];
						let m1 = matrix[ j*mw + i ];
						
						rx += r * m0;
						ry += r * m1;
						
						gx += g * m0;
						gy += g * m1;
						
						bx += b * m0;
						by += b * m1;
						
					}
				}
				
				let offset = (y * width + x) * 3;
				
				let r = clamp( Math.hypot( rx, ry )/gamma );
				let g = clamp( Math.hypot( gx, gy )/gamma );
				let b = clamp( Math.hypot( bx, by )/gamma );
				
				output[ offset++ ] = r;
				output[ offset++ ] = g;
				output[ offset++ ] = b;
				
			}
		}
		
		return output;
		
	}
	
	/// 
	/// 
	/// 
	
	/**	clahe
	 *	
	 *	@return {ImageRGB} new
	 */
	clahe() {
		
		///
		let { red, green, blue } = this.histogram();
		
		/// Calculating the CDF
		let cdf_r = clahe_cdf( red );
		let cdf_g = clahe_cdf( green );
		let cdf_b = clahe_cdf( blue );
		
		///
		for( let i = 0; i < this.length; i += 3 ) {
			
			this[ i   ] = clamp( cdf_r[ this[ i   ] ] );
			this[ i+1 ] = clamp( cdf_g[ this[ i+1 ] ] );
			this[ i+2 ] = clamp( cdf_b[ this[ i+2 ] ] );
			
		}
		
		return this;
		
	}
	
	/**	histogram
	 *	
	 *	@param {Number} wx			position x of window
	 *	@param {Number} wy			position y of window
	 *	@param {Number} ww			width of window
	 *	@param {Number} wh			height of window
	 *	@return {Object}			{ red, green, blue }
	 */
	histogram( wx, wy, ww, wh ) {
		
		let width = this.width;
		
		if( wx == undefined ) wx = 0;
		if( wy == undefined ) wy = 0;
		if( ww == undefined ) ww = width;
		if( wh == undefined ) wh = this.height;
		
		let red = new Object;
		let green = new Object;
		let blue = new Object;
		
		///
		let wmax = wx + ww;
		let hmax = wy + wh;
		
		for( let y = wy; y < hmax; y++ ) {
			
			let offset = y * width;
			
			for( let x = wx; x < wmax; x++ ) {
				
				let i = 3*(offset + x);
				let vr = this[i  ];
				let vg = this[i+1];
				let vb = this[i+2];
				
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
	
}
