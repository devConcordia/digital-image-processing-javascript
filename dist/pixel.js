(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.pixel = factory());
})(this, (function () { 'use strict';

	/**	ImageBinary
	 *	
	 *	erosion: ➤⊖
	 *	dilatation: ➤⊕
	 *	
	 */
	class ImageBinary extends Uint8Array {
		
		constructor( w, h, data ) {
			
			if( !data ) data = ( Math.ceil(w / 8) * h );
			
			super( data );
			
			this.width = w;
			this.height = h;
			
		}
		
		/*	FromImageData
		 *	
		 */
		static FromImageData( imagedata, thresholds = 127 ) {
			
			///
			let w = imagedata.width;
			let h = imagedata.height;
			
			let data = imagedata.data;
			
			let output = new ImageBinary(w, h);
			
			for( let y = 0; y < h; y++ ) {
				
				let offset = y * w;
				
				for( let x = 0; x < w; x += 8 ) {
					
					let b = 0;
					
					for( let xi = 0; xi < 8; xi++ ) {
						
						let v = (data[ (offset + x + xi) * 4 ] > thresholds)? 1 : 0;
						
						b = b | (v << (7 - xi));
						
					}
					
					let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
					
					output[ i ] = b;
					
				}
				
			}
			
			return output;
			
		}
		
		static FromImageGray( data, thresholds = 127 ) {
			
			///
			let w = data.width;
			let h = data.height;
			
			let output = new ImageBinary( w, h );
			
			for( let y = 0; y < h; y++ ) {
				
				let offset = y * w;
				
				for( let x = 0; x < w; x += 8 ) {
					
					let b = 0;
					
					for( let xi = 0; xi < 8; xi++ ) {
						
						let v = (data[ (offset + x + xi) ] > thresholds)? 1 : 0;
						
						b = b | (v << (7 - xi));
						
					}
					
					let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
					
					output[ i ] = b;
					
				}
				
			}
			
			return output;
			
		}
		
		toImageData() {
			
			let w = this.width;
			let h = this.height;
			
			let data = new Uint32Array( w * h );
			
			let byteStep = Math.ceil( w/8 );
			
			for( let i = 0; i < h; i++ ) {
				
				/// distancia em bits (y)
				let offset = i * w;
				
				for( let j = 0; j < byteStep; j++ ) {
					
					let b = this[ i * byteStep + j ];
					
					/// distancia em bits (x)
					let wj = j * 8;
					
					for( let n = 0; n < 8; n++ ) {
						
						/// distancia em bits (x)
						let wi = wj + n;
						
						if( wi > w ) break;
						
						data[ offset + wi ] = ((b >> (7-n)) & 1) > 0? 0xffffffff : 0xff000000;
						
					}
					
				}
			}
			
			return new ImageData( new Uint8ClampedArray(data.buffer), w, h );
			
		}
		
		toString( zero = '0', one = '1' ) {
			
			let output = "";
			
			let w = this.width;
			let h = this.height;
			let byteStep = Math.ceil( w/8 );
			
			for( let i = 0; i < h; i++ ) {
				
				let raw = "";
				
				for( let j = 0; j < byteStep; j++ )
					raw += this[ (i * byteStep + j) ].toString(2).padStart(8,'0');
				
				output += raw.slice(0,w) +"\n";
				
			}
			
			if( zero != '0' ) output = output.replace(/0/gim, zero);
			if( one != '1' ) output = output.replace(/1/gim, one);
			
			return output; // + "("+ this.width +"x"+ h +")";
			
		}
		
		////
		//// 
		////
		
		clone() {
			
			return new ImageBinary( this.width, this.height, this ); 
			
		}
		
		get( x, y ) {
			
			let w = this.width;
			
			/// byte index
			let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
			
			return (this[ i ] >> ( 7 - x % 8 )) & 1;
			
		}
		
		set( x, y, v ) {
			
			let w = this.width;
			
			/// byte index
			let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
			
			/// bit index
			let k = 7 - x % 8;
			
			let b = this[ i ];
			
			if( v == 1 ) {
				
				this[ i ] = b | (v << k);
			
			} else {
				
				this[ i ] = b & (~(1 << k) & 0xff);
			
			}
			
		}
		
		getOffset( x, y ) {
			
			let w = this.width;
			
			/// byte index
			let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
			
			/// byteoffset, bitoffset
			return [ i, 7 - x % 8 ];
			
		}
		
		////
		//// morphology
		////
		
		erode( matrix ) {
			
			let w = this.width;
			let h = this.height;
			
			const output = new ImageBinary( w, h );
			
			///
			let mw = matrix.width;
			let mh = matrix.height;
			
			let mwh = Math.floor( mw/2 );
			let mhh = Math.floor( mh/2 );
			
			const W8 = Math.ceil(w / 8);
			
			for( let y = 0; y < h; y++ ) {
				for( let x = 0; x < w; x++ ) {
					
					let v = 1;
					
					for( let i = 0; i < mh; i++ ) {
						
						let wy = y + i - mhh;
						
						if( wy < 0 || wy > h ) continue;
						
						let offset = wy * W8;
						
						for( let j = 0; j < mw; j++ ) {
							
							if( matrix[ i * mw + j ] == 0 ) continue;
							
							let wx = x + j - mwh;
							
							if( wx < 0 || wx > w ) continue;
							
								
							let b0 = (this[ offset + Math.floor( wx/8 ) ] >> ( 7 - wx % 8 )) & 1;
							
							if( b0 != matrix[ i * mw + j ] ) {
								
								v = 0;
								break;
								
							}
							
						}
						
						if( v == 0 ) break;
						
					}
					
					if( v == 1 ) {
									
						/// byte index
						let t = y * W8 + Math.floor( x/8 );
						
						/// bit index
						let k = 7 - x % 8;
						
						output[ t ] |= (1 << k);
					
					}
					
				}
			}
			
			
			return output;
			
		}
		
		dilate( matrix ) {
			
			let w = this.width;
			let h = this.height;
			
			const output = new ImageBinary( w, h );
			
			///
			let mw = matrix.width;
			let mh = matrix.height;
			
			let mwh = Math.floor( mw/2 );
			let mhh = Math.floor( mh/2 );
			
			const W8 = Math.ceil(w / 8);
			
			for( let y = 0; y < h; y++ ) {
				for( let x = 0; x < w; x++ ) {
					
					let v = 0;
					
					for( let i = 0; i < mh; i++ ) {
						
						let wy = y + i - mhh;
						
						if( wy < 0 || wy > h ) continue;
						
						let offset = wy * W8;
						
						for( let j = 0; j < mw; j++ ) {
							
							if( matrix[ i * mw + j ] == 0 ) continue;
							
							let wx = x + j - mwh;
							
							if( wx < 0 || wx > w ) continue;
							
								
							let b0 = (this[ offset + Math.floor( wx/8 ) ] >> ( 7 - wx % 8 )) & 1;
							
							if( b0 == matrix[ i * mw + j ] ) {
								
								v = 1;
								break;
								
							}
							
						}
						
						if( v == 1 ) break;
						
					}
					
					if( v == 1 ) {
										
						/// byte index
						let t = y * W8 + Math.floor( x/8 );
						
						/// bit index
						let k = 7 - x % 8;
						
						output[ t ] |= (1 << k);
					
					}
					
				}
			}
			
			return output;
			
		}
		
		open( m, n, matrix ) {
			
			if( !matrix ) matrix = new Uint8Array(m*n).fill(1);
			
			return this.erode( m, n, matrix ).dilate( m, n, matrix );
		
		}
		
		close( m, n, matrix ) {
			
			if( !matrix ) matrix = new Uint8Array(m*n).fill(1);
			
			return this.dilate( m, n, matrix ).erode( m, n, matrix );
		
		}
		
		////
		//// bitwise operators
		////
		
		inverse() {
			
			let output = new ImageBinary( this.width, this.height );
			
			for( let i = 0; i < this.length; i++ )
				output[i] = (~this[i] >>> 0) & 0xff;
			
			return output;
			
		}
		
		or( binary ) {
			
			let output = new ImageBinary( this.width, this.height );
			
			for( let i = 0; i < this.length; i++ )
				output[i] = this[i] | binary[i];
			
			return output;
			
		}
		
		and( binary ) {
			
			let output = new ImageBinary( this.width, this.height );
			
			for( let i = 0; i < this.length; i++ )
				output[i] = this[i] & binary[i];
			
			return output;
			
		}
		
		xor( binary ) {
			
			let output = new ImageBinary( this.width, this.height );
			
			for( let i = 0; i < this.length; i++ )
				output[i] = this[i] ^ binary[i];
			
			return output;
			
		}
		
		////
		//// 
		////
		
		equals( b ) {
			
			if( this.length != b.length ) return false;
			
			for( let i = 0; i < this.length; i++ )
				if( this[i] != b[i] ) return false;
			
			return true;
			
		}
		
		countNonZero() {
			
			let output = 0;
			
			for( let i = 0; i < this.length; i++ ) {
				
				let v = this[i];
				
				if( v > 0 ) {
					
					for( let k = 0; k < 8; k++ )
						if( (v >> k)&1 == 1 ) output++;
					
				}
			}
			
			return output;
			
		}
		
		
		/* * /
		
		remove( matrix ) {
			
			if( !matrix ) return this;
			
		//	let output = new ImageBinary( this.width, this.height );
			
			let w = this.width;
			let h = this.height;
			
			let mh = Math.floor( m/2 ),
				nh = Math.floor( n/2 );
			
			const W8 = Math.ceil(w / 8);
			
			
			let count = 0;
			
			for( let y = 0; y < h; y++ ) {
				for( let x = 0; x < w; x++ ) {
					
					let isEqual = true;
					
					for( let i = 0; i < m; i++ ) {
						
						let wy = y + i - mh;
						
						if( wy < 0 || wy > h ) continue;
						
						let offset = wy * W8;
						
						for( let j = 0; j < n; j++ ) {
							
						//	if( matrix[ i * n + j ] == 0 ) continue;
							
							let wx = x + j - nh;
							
							if( wx < 0 || wx > w ) continue;
							
								
							let b0 = (this[ offset + Math.floor( wx/8 ) ] >> ( 7 - wx % 8 )) & 1;
							
							if( b0 != matrix[ i * n + j ] ) {
								
								isEqual = false;
								break;
								
							}
							
						}
						
						if( !isEqual ) break;
						
					}
					
					if( isEqual ) {
									
						/// byte index
						let t = y * W8 + Math.floor( x/8 );
						
						/// bit index
						let k = 7 - x % 8;
						
						this[ t ] = this[ t ] & (~(1 << k) & 0xff);
						
						count++
						
					}
					
				}
			}
			
		//	console.log( count, "de", this.width * this.height );
			
			return this;
			
			
		}
		
		/* */
		
		hitOrMiss( matrix ) {
			
			return this.open( matrix ).close( matrix );
			
		}
		
		boundary( matrix ) {
			
			let erosion = this.erode( matrix );
			
			return this.xor( erosion );
			
		}
		
		/** flood | floodFill
		 *	@ref https://codereview.stackexchange.com/questions/8946/garbage-collection-loop-in-game-of-life/8947#8947
		 *	
		 *	preenchimento (com 1) de uma area apartir da posição informada
		 *	
		 */
		flood( x0 = 0, y0 = 0 ) {
			
			let output = this.clone();
			
			let w = this.width,
				h = this.height;
			
			const W8 = Math.ceil( w/8 );
			
			let cache = [];
			
			let visited = new ImageBinary( w, h );
			
			
			visited[ (y0 * W8 + Math.floor( x0/8 )) ] = 1 << (7 - x0 % 8);
			cache.push([ x0, y0 ]);
			
			while( cache.length > 0 ) {
				
				let [ x, y ] = cache.shift();
				
				/// byte index
				let j0 = Math.floor( x/8 );
				let i0 = y * W8;
				
				let n0 = i0 + j0;
				
				/// bit index
				let k0 = 7 - x % 8;
				
				output[ n0 ] |= 1 << k0;
				
				let x1 = x - 1;
				if( x1 >= 0 && x1 < w ) {
					
					let j1 = Math.floor( x1/8 );
					let n1 = i0 + j1;
					let k1 = 7 - (x1 % 8);
					
					if( ((output[n1] >> k1) & 1) == 0 ) {
						
						if( (visited[ n1 ] >> k1 & 1) == 0 ) {
							visited[ n1 ] |= 1 << k1;
							cache.push([ x1, y ]);
						}
						
					}
					
				}
				
				let x2 = x + 1;
				if( x2 >= 0 && x2 < w ) {
					
					let j2 = Math.floor( x2/8 );
					let n2 = i0 + j2;
					let k2 = 7 - x2 % 8;
				
					if( ((output[n2] >> k2) & 1) == 0 ) {
						
						if( (visited[ n2 ] >> k2 & 1) == 0 ) {
							visited[ n2 ] |= 1 << k2;
							cache.push([ x2, y ]);
						}
						
					}
				
				}
				
				let y1 = y - 1;
				if( y1 >= 0 && y1 < h ) {
					
					let n3 = y1 * W8 + j0;
					
					if( ((output[n3] >> k0) & 1) == 0 ) {
						
						if( (visited[ n3 ] >> k0 & 1) == 0 ) {
							visited[ n3 ] |= 1 << k0;
							cache.push([ x, y1 ]);
						}
						
					}
					
				}
				
				let y2 = y + 1;
				if( y2 >= 0 && y2 < h ) {
					
					let n4 = y2 * W8 + j0;
					
					if( ((output[n4] >> k0) & 1) == 0 ) {
						
						if( (visited[ n4 ] >> k0 & 1) == 0 ) {
							visited[ n4 ] |= 1 << k0;
							cache.push([ x, y2 ]);
						}
						
					}
					
				}
				
			}
			
			return output;
			
		}
		
		/** hole | holesFill
		 *	
		 *	
		 *	
		 */
		holeFill() {
			
			return this.flood().inverse().or( this );
			
		}
		
		/** thinning | skeleton
		 *	
		 *	@ref https://stackoverflow.com/questions/33095476/is-there-a-build-in-function-to-do-skeletonization
		 *	@ref https://theailearner.com/tag/thinning-opencv/
		 *	
		 */
		thinning( radial, limiti = 100 ) {
			
			let input = this.clone();
			
			let size = this.width * this.height;
			let output = new ImageBinary( this.width, this.height );
			
			while( limiti-- > 0 ) {
				
				let eroded = input.erode( radial );
				
				let temp = eroded.dilate( radial );
					temp = input.xor( temp );
				
				output = output.or( temp );
				input = eroded.clone();
				
				let zeros = size - input.countNonZero();
				
				if( zeros == size ) break;
				
			}
			
			return output;
			
		}
		
	}

	/** clamp
	 *	
	 *	@param {Number} a
	 *	@param {Number} b = 0
	 *	@param {Number} c = 255
	 *	@return {Number}			integer
	 */
	function clamp( a, b = 0, c = 255 ) {
		
		return Math.min( Math.max( Math.floor(a), b ), c )

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
	function clahe_cdf( histogram ) {
		
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

	/** ImageGray
	 *	
	 */
	class ImageGray extends Uint8Array {
		
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
		
		toImageData() {
			
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

	/** ImageRGB
	 *	
	 */
	class ImageRGB extends Uint8Array {
		
		constructor( w, h, data = null ) {
			
			if( data == null ) data = 3 * w * h;
			
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
		
		/**	toImageData
		 *	
		 *	@return {ImageData}
		 */
		toImageData() {
			
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

	/** Matrix
	 *	
	 *	Outhers:
	 *	@ref https://en.wikipedia.org/wiki/Roberts_cross
	 *	
	 */
	class Matrix extends Float32Array {
		
		/** 
		 *	
		 *	@param {Number} w		columns
		 *	@param {Number} h		rows
		 */
		constructor( w, h, data ) {
			
			if( data == undefined ) data = w * h;
			
			super( data );
			
			this.width = w;
			this.height = h;
			
		}
		
		static Zeros( w, h ) {
			
			return new Matrix( w, h );
			
		}
		
		static Ones( w, h ) {
			
			return new Matrix( w, h ).fill(1);
			
		}
		
		/** Dot
		 *	
		 */
		static Dot() {
			
			return new Matrix( 3, 3, [
				1, 1, 1, 
				1,-8, 1, 
				1, 1, 1 
			]);
			
		}
		
		static Sharpen() {
			
			return new Matrix( 3, 3, [
				0, 1, 0, 
				1,-5, 1, 
				0, 1, 0 
			]);
			
		}
		
		static Emboss() {
			
			return new Matrix( 3, 3, [
				-2,-1, 0, 
				-1, 1, 1, 
				 0, 1, 2
			]);
			
		}
		
		/** Prewitt
		 *
		 *	@ref https://en.wikipedia.org/wiki/Prewitt_operator
		 *
		 */
		static Prewitt() {
			
			return new Matrix( 3, 3, [
				1, 0, -1,
				1, 0, -1,
				1, 0, -1
			]);
			
		}
		
		/** Sobel
		 *
		 *	@ref https://en.wikipedia.org/wiki/Sobel_operator
		 *
		 */
		static Sobel( w = 2 ) {
			
			return new Matrix( 3, 3, [
				1, 0, -1,
				w, 0, -w,
				1, 0, -1
			]);
			
		}
		
		/** Feldman
		 *
		 *	@ref https://en.wikipedia.org/wiki/Sobel_operator
		 *
		 */
		static Feldman() {
			
			return new Matrix( 3, 3, [
				  3, 0,  -3,
				 10, 0, -10,
				  3, 0,  -3
			]);
			
		}
		
		/** Scharr
		 *
		 *	@ref https://en.wikipedia.org/wiki/Sobel_operator
		 *
		 */
		static Scharr() {
			
			return new Matrix( 3, 3, [
				  47, 0,  -47,
				 162, 0, -162,
				  47, 0,  -47
			]);
			
		}
		
		/**Laplace
		 *
		 *	@ref https://en.wikipedia.org/wiki/Discrete_Laplace_operator
		 *
		 */
		static Laplace() {
			
			return new Matrix( 3, 3, [
				0, 1, 0, 
				1,-4, 1, 
				0, 1, 0 
			]);
			
		}
		
		
		/** GaussianBlur
		 *
		 *	@ref https://en.wikipedia.org/wiki/Gaussian_blur
		 *
		 */
		static GaussianBlur( size = 5, sigma = 1.3 ) {
			
			let output = new Matrix( size, size );
			
			let ss = Math.pow( sigma, 2 );
			
			let s1 = 2 * ss;
			let s2 = 1 / (Math.PI * s1);
			
			let half = Math.floor( size / 2 );
			
			let index = 0;
			
			for( let y = -half; y <= half; y++ ) {
				for( let x = -half; x <= half; x++ ) {
					
					output[ index++ ] = s2 * Math.pow( Math.E , -((x*x + y*y) / s1) );
					
				}
			}
			
			return output;
			
		}
		
		
		/** Radial
		 *	
		 */
		static Radial( size ) {
			
			if( size%2 == 0 ) 
				throw new Error("pixel.Matrix.Radial: not works with even numbers");
			
			let radius = Math.floor(size/2);
			
			let output = new Matrix( size, size );
			
			for( let i = 0; i < size; i++ ) {
				
				let offset = i * size;
				
				for( let j = 0; j < size; j++ )
					output[ offset + j ] = ( Math.hypot( i - radius, j - radius ) > radius )? 0 : 1;
				
			}
			
			return output;
			
		}
		
		toString( digitis = 2 ) {
			
			let output = "";
			
			for( let i = 0; i < this.height; i++ ) {
				
				let offset = i * this.width;
				let data = [];
				
				for( let j = 0; j < this.width; j++ ) 
					data.push( this[ offset + j ].toFixed(digitis) );
				
				output += data.join(" ") +"\n";
			}
			
			return output;
			
		}
		
	}

	/** load
	 *	
	 *	@param {String} path
	 *	@param {Function} handlerCallback
	 */
	function load( path, handlerCallback ) {
		
		var source = new Image();
		
		source.onload = function() {
			
			let context = createContext( source );
			
			let imagedata = context.getImageData( 0, 0, source.width, source.height );
			
			handlerCallback( context, imagedata );
			
		};
		
		source.src = path;
			
	}


	/** createContext
	 *	
	 *	@param {Image|HTMLCanvasElement|ImageData} source
	 *	@param {HTMLElement} parentNode
	 *	@return {CanvasRenderingContext2D}
	 */
	function createContext( source, parentNode = null ) {
		
		var canvas = document.createElement("canvas"),
			context = canvas.getContext("2d");
		
		if( source ) {
			
			canvas.width = source.width;
			canvas.height = source.height;
			
			if( source instanceof Image || source instanceof HTMLCanvasElement) {
				
				context.drawImage( source, 0, 0, source.width, source.height );
			
			} else if( source instanceof ImageData ) {
				
				context.putImageData( source, 0, 0 );
			
			}
			
		}
		
		///
		if( parentNode instanceof HTMLElement )
			parentNode.appendChild( canvas );
		
		///
		return context;
		
	}


	///
	var index = { 
		load, createContext,
		ImageBinary, ImageGray, ImageRGB, 
		Matrix 
	};

	return index;

}));
