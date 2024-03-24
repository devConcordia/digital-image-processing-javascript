/**	ImageBinary
 *	
 *	@ref Rafael C. Gonzalez; Richard E. Woods. **Digital Image Processing**. Fourth Edition. Pearson Education. 2018.
 *	
 */
export default class ImageBinary extends Uint8Array {
	
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
	
	getImageData() {
		
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
	
	/** inverse
	 *	
	 *	@return {ImageBinary} new
	 */
	inverse() {
		
		let output = new ImageBinary( this.width, this.height );
		
		for( let i = 0; i < this.length; i++ )
			output[i] = (~this[i] >>> 0) & 0xff;
		
		return output;
		
	}
	
	/** or
	 *	
	 *	@param {ImageBinary} binary
	 *	@return {ImageBinary} new
	 */
	or( binary ) {
		
		let output = new ImageBinary( this.width, this.height );
		
		for( let i = 0; i < this.length; i++ )
			output[i] = this[i] | binary[i];
		
		return output;
		
	}
	
	/** and
	 *	
	 *	@param {ImageBinary} binary
	 *	@return {ImageBinary} new
	 */
	and( binary ) {
		
		let output = new ImageBinary( this.width, this.height );
		
		for( let i = 0; i < this.length; i++ )
			output[i] = this[i] & binary[i];
		
		return output;
		
	}
	
	/** xor
	 *	
	 *	@param {ImageBinary} binary
	 *	@return {ImageBinary} new
	 */
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
	thinning( matrix, limiti = 100 ) {
		
		let input = this.clone();
		
		let size = this.width * this.height;
		let output = new ImageBinary( this.width, this.height );
		
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
