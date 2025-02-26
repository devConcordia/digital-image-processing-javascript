
import Color from './common/Color.mjs';

/**	BinaryImageData
 *	
 *	@ref Rafael C. Gonzalez; Richard E. Woods. **Digital Image Processing**. Fourth Edition. Pearson Education. 2018.
 *	
 */
export default class BinaryImageData {
	
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
				
				dataArray = Math.ceil(width / 8) * height;
				
			} else {
				
				dataArray = arguments[0];
				width = arguments[1];
				height = dataArray.length / width;
				
			}
			
		}
		
		this.data = new Uint8Array( dataArray );
		this.width = width;
		this.height = height;
		
	}
	
	/*	From
	 *	
	 */
	static From( input, thresholds = 127 ) {
		
		///
		let w = input.width;
		let h = input.height;
		
		let indata = input.data;
		
		/// adaptação para o caso de ser ImageData/ColorImageData ou um GrayImageData
		let setp = (input instanceof ImageData)? 4 : 1;
		
		let output = new BinaryImageData(w, h);
		let outdata = output.data;
		
		///
		for( let y = 0; y < h; y++ ) {
			
			let offset = y * w;
			
			for( let x = 0; x < w; x += 8 ) {
				
				let b = 0;
				
				for( let xi = 0; xi < 8; xi++ ) {
					
					let v = (indata[ (offset + x + xi) * setp ] > thresholds)? 1 : 0;
					
					b = b | (v << (7 - xi));
					
				}
				
				let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
				
				outdata[ i ] = b;
				
			}
			
		}
		
		return output;
		
	}
	
	
	getImageData() {
		
		let w = this.width;
		let h = this.height;
		
		let indata = this.data;
		
		let data = new Uint32Array( w * h );
		
		let byteStep = Math.ceil( w/8 );
		
		let black = Color.Hex( 0x000000 ).getBytes();
		let white = Color.Hex( 0xffffff ).getBytes();
		
		for( let i = 0; i < h; i++ ) {
			
			/// distancia em bits (y)
			let offset = i * w;
			
			for( let j = 0; j < byteStep; j++ ) {
				
				let b = indata[ i * byteStep + j ];
				
				/// distancia em bits (x)
				let wj = j * 8;
				
				for( let n = 0; n < 8; n++ ) {
					
					/// distancia em bits (x)
					let wi = wj + n;
					
					if( wi > w ) break;
					
					data[ offset + wi ] = ((b >> (7-n)) & 1) > 0? white : black;
					
				}
				
			}
		}
		
		return new ImageData( new Uint8ClampedArray(data.buffer), w, h );
		
	}
	
	toString( zero = '0', one = '1' ) {
		
		let output = "";
		
		let w = this.width;
		let h = this.height;
		let data = this.data;
		
		let byteStep = Math.ceil( w/8 );
		
		for( let i = 0; i < h; i++ ) {
			
			let raw = "";
			
			for( let j = 0; j < byteStep; j++ )
				raw += data[ (i * byteStep + j) ].toString(2).padStart(8,'0');
			
			output += raw.slice(0,w) +"\n";
			
		}
		
		if( zero != '0' ) output = output.replace(/0/gim, zero);
		if( one != '1' ) output = output.replace(/1/gim, one);
		
		return output; // + "("+ this.width +"x"+ h +")";
		
	}
	
	///
	/// 
	///
	
	clone() {
		
		return new BinaryImageData( this.data, this.width, this.height ); 
		
	}
	
	getOffset( x, y ) {
		
		let w = this.width;
		
		/// byte index
		let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
		
		/// byteoffset, bitoffset
		return [ i, 7 - x % 8 ];
		
	}
	
	get( x, y ) {
		
		let w = this.width;
		
		/// byte index
		let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
		
		return (this.data[ i ] >> ( 7 - x % 8 )) & 1;
		
	}
	
	set( x, y, v ) {
		
		let w = this.width;
		let data = this.data;
		
		/// byte index
		let i = y * Math.ceil( w/8 ) + Math.floor( x/8 );
		
		/// bit index
		let k = 7 - x % 8;
		
		let b = data[ i ];
		
		if( v == 1 ) {
			
			data[ i ] = b | (v << k);
		
		} else {
			
			data[ i ] = b & (~(1 << k) & 0xff);
		
		}
		
	}
	
	/** equals
	 *	
	 *	@param {BinaryImageData} input
	 *	@return {Boolean}
	 */
	equals( input ) {
		
		let adata = this.data;
		let bdata = input.data;
		
		if( adata.length == bdata.length )
			for( let i = 0; i < adata.length; i++ )
				if( adata[i] != bdata[i] ) return false;
		
		return true;
		
	}
	
	/** countNonZero
	 *	
	 *	@return {Number}
	 */
	countNonZero() {
		
		let data = this.data;
		
		let output = 0;
		
		for( let i = 0; i < data.length; i++ ) {
			
			let v = data[i];
			
			if( v > 0 ) {
				
				for( let k = 0; k < 8; k++ )
					if( (v >> k)&1 == 1 ) output++;
				
			}
		}
		
		return output;
		
	}
	
	///
	/// bitwise operators
	///
	
	/** and
	 *	
	 *	@param {BinaryImageData} input
	 *	@return {BinaryImageData}
	 */
	and( input ) {
		
		let adata = this.data;
		let bdata = input.data;
		
		let output = new BinaryImageData( this.width, this.height );
		let outdata = output.data;
		
		for( let i = 0; i < data.length; i++ )
			outdata[i] = data[i] & bdata[i];
		
		return outdata;
		
	}
	
	/** or
	 *	
	 *	@param {BinaryImageData} input
	 *	@return {BinaryImageData}
	 */
	or( input ) {
		
		let adata = this.data;
		let bdata = input.data;
		
		let output = new BinaryImageData( this.width, this.height );
		let outdata = output.data;
		
		for( let i = 0; i < adata.length; i++ )
			outdata[i] = adata[i] | bdata[i];
		
		return output;
		
	}
	
	/** xor
	 *	
	 *	@param {BinaryImageData} input
	 *	@return {BinaryImageData}
	 */
	xor( input ) {
		
		let adata = this.data;
		let bdata = input.data;
		
		let output = new BinaryImageData( this.width, this.height );
		let outdata = output.data;
		
		for( let i = 0; i < adata.length; i++ )
			outdata[i] = adata[i] ^ bdata[i];
		
		return output;
		
	}
	
	/** not
	 *	
	 *	@return {BinaryImageData}
	 */
	not() {
		
		let adata = this.data;
		
		let output = new BinaryImageData( this.width, this.height );
		let outdata = output.data;
		
		for( let i = 0; i < adata.length; i++ )
			outdata[i] = (~adata[i] >>> 0) & 0xff;
		
		return output;
		
	}
	
	///
	/// morphology
	///
	
	/** erode
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	erode( matrix ) {
		
		let w = this.width;
		let h = this.height;
		let data = this.data;
		
		let output = new BinaryImageData( w, h );
		let outdata = output.data;
		
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
						
							
						let b0 = (data[ offset + Math.floor( wx/8 ) ] >> ( 7 - wx % 8 )) & 1;
						
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
					
					outdata[ t ] |= (1 << k);
				
				}
				
			}
		}
		
		
		return output;
		
	}
	
	/** dilate
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	dilate( matrix ) {
		
		let w = this.width;
		let h = this.height;
		let data = this.data;
		
		let output = new BinaryImageData( w, h );
		let outdata = output.data;
		
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
						
							
						let b0 = (data[ offset + Math.floor( wx/8 ) ] >> ( 7 - wx % 8 )) & 1;
						
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
					
					outdata[ t ] |= (1 << k);
				
				}
				
			}
		}
		
		return output;
		
	}
	
	/** open
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	open( matrix ) {
		
		return this.erode( matrix ).dilate( matrix );
	
	}
	
	/** close
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	close( matrix ) {
		
		return this.dilate( matrix ).erode( matrix );
	
	}
	
	/** hitOrMiss
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	hitOrMiss( matrix ) {
		
		return this.open( matrix ).close( matrix );
		
	}
	
	/** boundary
	 *	
	 *	@param {Matrix} matrix			pixel.Matrix.Ones(3,3), pixel.Matrix.Radial(5), ...
	 *	@return {BinaryImageData}
	 */
	boundary( matrix ) {
		
		let erosion = this.erode( matrix );
		
		return this.xor( erosion );
		
	}
	
	/** flood
	 *	
	 *	@ref https://codereview.stackexchange.com/questions/8946/garbage-collection-loop-in-game-of-life/8947#8947
	 *	
	 *	preenchimento (com 1) de uma area apartir da posição informada
	 *	
	 *	@param {Number} x0
	 *	@param {Number} y0
	 *	@return {BinaryImageData}
	 */
	flood( x0 = 0, y0 = 0 ) {
		
		let output = this.clone();
		let outdata = output.data;
		
		let w = this.width,
			h = this.height;
		
		const W8 = Math.ceil( w/8 );
		
		let cache = [];
		
		let visited = new BinaryImageData( w, h );
		let vdata = visited.data;
		
		vdata[ (y0 * W8 + Math.floor( x0/8 )) ] = 1 << (7 - x0 % 8);
		cache.push([ x0, y0 ]);
		
		while( cache.length > 0 ) {
			
			let [ x, y ] = cache.shift();
			
			/// byte index
			let j0 = Math.floor( x/8 );
			let i0 = y * W8;
			
			let n0 = i0 + j0;
			
			/// bit index
			let k0 = 7 - x % 8;
			
			outdata[ n0 ] |= 1 << k0;
			
			let x1 = x - 1;
			if( x1 >= 0 && x1 < w ) {
				
				let j1 = Math.floor( x1/8 );
				let n1 = i0 + j1;
				let k1 = 7 - (x1 % 8);
				
				if( ((outdata[n1] >> k1) & 1) == 0 ) {
					
					if( (vdata[ n1 ] >> k1 & 1) == 0 ) {
						vdata[ n1 ] |= 1 << k1;
						cache.push([ x1, y ]);
					}
					
				}
				
			}
			
			let x2 = x + 1;
			if( x2 >= 0 && x2 < w ) {
				
				let j2 = Math.floor( x2/8 );
				let n2 = i0 + j2;
				let k2 = 7 - x2 % 8;
			
				if( ((outdata[n2] >> k2) & 1) == 0 ) {
					
					if( (vdata[ n2 ] >> k2 & 1) == 0 ) {
						vdata[ n2 ] |= 1 << k2;
						cache.push([ x2, y ]);
					}
					
				}
			
			}
			
			let y1 = y - 1;
			if( y1 >= 0 && y1 < h ) {
				
				let n3 = y1 * W8 + j0;
				
				if( ((outdata[n3] >> k0) & 1) == 0 ) {
					
					if( (vdata[ n3 ] >> k0 & 1) == 0 ) {
						vdata[ n3 ] |= 1 << k0;
						cache.push([ x, y1 ]);
					}
					
				}
				
			}
			
			let y2 = y + 1;
			if( y2 >= 0 && y2 < h ) {
				
				let n4 = y2 * W8 + j0;
				
				if( ((outdata[n4] >> k0) & 1) == 0 ) {
					
					if( (vdata[ n4 ] >> k0 & 1) == 0 ) {
						vdata[ n4 ] |= 1 << k0;
						cache.push([ x, y2 ]);
					}
					
				}
				
			}
			
		}
		
		return output;
		
	}
	
	/** fillHoles
	 *	
	 */
	fillHoles() {
		
	//	return this.flood().not().or( this );
		
		let copy = this.clone();
		
		return this.flood().not().or( copy );
		
	}
	
	/** thinning
	 *	
	 *	@ref https://stackoverflow.com/questions/33095476/is-there-a-build-in-function-to-do-skeletonization
	 *	@ref https://theailearner.com/tag/thinning-opencv/
	 *	
	 */
	thinning( matrix, limiti = 100 ) {
		
		let input = this.clone();
		
		let size = this.width * this.height;
		let output = new BinaryImageData( this.width, this.height );
		
		while( limiti-- > 0 ) {
			
			let eroded = input.erode( matrix );
			
			let temp = eroded.dilate( matrix );
				temp = input.xor( temp );
			
			output = output.or( temp );
			input = eroded.clone();
			
			let zeros = size - input.countNonZero();
			
			if( zeros == size ) break;
			
		}
		
		return output;
		
	}
	
}
