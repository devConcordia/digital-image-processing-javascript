
/** Rect
 *	
 *	@param {Number} x, y, w, h
 */
class Rect extends Int16Array {
		
	constructor( x, y, w, h ) {
		
		super([ x, y, w, h ]);
		
	}
	
	get x() { return this[0] }
	get y() { return this[1] }
	
	get width() { return this[2] }
	get height() { return this[3] }
	
	set x( n ) { this[0] = n; }
	set y( n ) { this[1] = n; }
	
	set width( n ) { this[2] = n; }
	set height( n ) { this[3] = n; }
	
	toJSON() {
		
		return Array.from( this )
		
	}
	
}

/** Point
 *	
 */
class Point extends Int16Array {
	
	constructor( x = 0, y = 0 ) {
		
		super([ x, y ]);
		
	}
	
	get x() { return this[0] }
	get y() { return this[1] }
	
	set x( v ) { this[0] = v; }
	set y( v ) { this[1] = v; }
	
	equals( p ) {
		
		return this[0] == p[0] && this[1] == p[1]
		
	}
	
	distance( p ) {
		
		return Math.hypot( this[0] - p[0], this[1] - p[1] )
		
	}
	
	toJSON() {
		
		return Array.from( this )
		
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

/** 
 *	
 */
function inRange( x, xa, xb ) { return x >= xa && x <= xb }

/** 
 *	
 */
function outRange( x, xa, xb ) { return x < xa || x > xb }


/**	calcCdf (Cumulative Distribution Function)
 *	
 */
function calcCdf( histogram ) {
	
	// Extrair as chaves (bins) e valores (frequências) do histograma
	const keys = Object.keys(histogram);
	const values = Object.values(histogram);
	
	// Calcular a soma total dos valores do histograma
	const sum = values.reduce((acc, val) => acc + val, 0);
	
	// Calcular o CDF diretamente e armazenar em um novo objeto
	const output = new Object;
	let cumulative = 0;
	
	for( let i = 0; i < values.length; i++ ) {
		
		// Atualiza o acumulado
		cumulative += values[i] / sum;
		
		// Calcula a equalização
		output[ keys[i] ] = Math.floor(256 * cumulative);
		
	}
	
	return output;
	
}

/** Device
 *	
 * 
 */
class Device {
	
	///
//	static BYTE_ORDER_BE = 'big-endian';
//	static BYTE_ORDER_ME = 'mixed-endian';
//	static BYTE_ORDER_LE = 'little-endian';
	
	static BIG_ENDIAN = 'big-endian';
	static MIXED_ENDIAN = 'mixed-endian';
	static LITTLE_ENDIAN = 'little-endian';
	
	/** GetEndianness | GetByteOrder
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Endianness
	 *	
	 *	new Uint32Array([ 0xAABBCCDD ])
	 *	
	 *		BE: [ 0xAA, 0xBB, 0xCC, 0xDD ]
	 *		LE: [ 0xDD, 0xCC, 0xBB, 0xAA ]
	 *		ME: [ 0xBB, 0xAA, 0xDD, 0xCC ]
	 *	
	 */
	static GetEndianness() {
		
		let bytes = new Uint32Array([ 0xAABBCCDD ]);
		let data = new Uint8Array( bytes.buffer );
		
		if( data[0] === 0xAA && data[1] === 0xBB && data[2] === 0xCC && data[3] === 0xDD ) {
			
			return Device.BIG_ENDIAN;
			
		} else if( data[0] === 0xDD && data[1] === 0xCC && data[2] === 0xBB && data[3] === 0xAA ) {
			
			return Device.LITTLE_ENDIAN;
			
		} else if( data[0] === 0xBB && data[1] === 0xAA && data[2] === 0xDD && data[3] === 0xCC ) {
			
			return Device.MIXED_ENDIAN;
			
		}
		
		else ;
		
	}
	
}

/** hue
 *
 *	@param {Number} t
 *	@param {Number} p
 *	@param {Number} q
 *	@return {Number}
 */
function hue( t, p, q ) {

	if( t < 0 ) t += 1;
	if( t > 1 ) t -= 1;

	if( t < 1/6 ) return p + (q - p) * 6 * t;
	if( t < 1/2 ) return q;
	if( t < 2/3 ) return p + (q - p) * (2/3 - t) * 6;

	return p;

}
/** Color [ R, G, B, A ]
 *	
 */
class Color extends Uint8Array {
	
	constructor( r = 0, g = 0, b = 0, a = 255 ) {
		
		super([ r, g, b, a ]);
		
	}
	
	get r() { return this[0] }
	get g() { return this[1] }
	get b() { return this[2] }
	get a() { return this[3] }
	
	set r( v ) { this[0] = clamp(v); }
	set g( v ) { this[1] = clamp(v); }
	set b( v ) { this[2] = clamp(v); }
	set a( v ) { this[3] = clamp(v); }

	get hex() {
		
		let [ r, g, b ] = this;
		
		return ((r << 16) | (g << 8) | b) >>> 0;
		
	}
	
	toString() { 
		
		return '#'+ this.hex.toString(16).toUpperCase().padStart(6,'0')
	
	}
	
	/* */
	
	
	/** gray
	 *	
	 *	BT.601-7
	 *	@ref https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
	 *	
	 *	@return {Color}
	 */
	gray() {
		
		let [ r, g, b ] = this;
		
		let s = Math.floor( 0.2989 * r + 0.5870 * g + 0.1140 * b );

		this[0] = s;
		this[1] = s;
		this[2] = s;

		return this;

	}
	
	/** negative
	 *	
	 *	@return {Color}
	 */
	negative() {

		this[0] = 255 - this[0];
		this[1] = 255 - this[1];
		this[2] = 255 - this[2];

		return this;

	}
	/* */
	
	getCMYK() {

		let [ r, g, b ] = this;
		
		r = r/255;
		g = g/255;
		b = b/255;
		
		///
		let c = 0, 
			m = 0, 
			y = 0,
			k = 1 - Math.max( r, g, b );

		if( k != 1 ) {
			
			c = ( 1-r-k )/( 1-k );
			m = ( 1-g-k )/( 1-k );
			y = ( 1-b-k )/( 1-k );

		}

		return [ c, m, y, k ];

	}

	setCMYK( c, m, y, k ) {
		
		c = 1 - c;
		m = 1 - m;
		y = 1 - y;
		k = 1 - k;
		
		this[0] = clamp( c * k * 256 );
		this[1] = clamp( m * k * 256 );
		this[2] = clamp( y * k * 256 );
		
		return this;
		
	}

	getHSL() {
		
		let [ r, g, b ] = this;
		
		r = r/255;
		g = g/255;
		b = b/255;
		
		let max = Math.max( r, g, b ),
			min = Math.min( r, g, b );

		let h = 0,
			s = 0,
			l = ( max + min )/2;

		if( max !== min ) {

			let d = max - min;

			s = ( l > 0.5 )? d/(2 - max - min) : d/( max+min );

			switch( max ) {

				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;

			}

			h /= 6;
			
		}
		
		/// 
		/// converte para graus
		h = h * 360;
		
		return [ h, s, l ];

	}

	setHSL( h, s, l ) {

		if( s == 0 ) {
			
			let grayScale = clamp( l * 256 );
			
			this[0] = grayScale;
			this[1] = grayScale;
			this[2] = grayScale;
			
		} else {
			
			let q = ( l < 0.5 )? (l * ( 1 + s )) : (l + s - l * s),
				p = 2 * l - q;
			
			h = h/360;
			
			let r = hue( h + 1/3, p, q ), 
				g = hue( h, p, q ),
				b = hue( h - 1/3, p, q );
			
			this[0] = clamp( r * 256 );
			this[1] = clamp( g * 256 );
			this[2] = clamp( b * 256 );
			
		}
		
		return this;
		
	}
	
	getHSV() {
		
		let [ r, g, b ] = this;
		
		r = r/255;
		g = g/255;
		b = b/255;
		
		///
		let min = Math.min( r, g, b ),
			max = Math.max( r, g, b ),
			delta = max - min;

		if( delta == 0 ) return [ 0, 0, 0 ];

		let h;

		switch( max ) {
			
			case r: h = ( g - b )/delta; break;
			case g: h = 2 + ( b - r )/delta; break;
			case b: h = 4 + ( r - g )/delta; break;
			
		}

		h /= 6;

		if( h < 0 ) h += 1;
		
		/// 
		/// converte para graus
		h = h * 360;
		
		return [ h, delta / max, max ];

	}

	setHSV( h, s, v ) {

		let h60 = h/60;
		
		let f = h60 - Math.floor( h60 ),
			r, g, b;

		switch( Math.floor( h60 )%6 ) {

			case 0:
					r = v;
					g = v * (1 - (1 - f) * s);
					b = v * (1 - s);
				break;

			case 1:
					r = v * (1 - f * s);
					g = v;
					b = v * (1 - s);
				break;

			case 2:
					r = v * (1 - s);
					g = v;
					b = v * (1 - (1 - f) * s);
				break;

			case 3:
					r = v * (1 - s);
					g = v * (1 - f * s);
					b = v;
				break;

			case 4:
					r = v * (1 - (1 - f) * s);
					g = v * (1 - s);
					b = v;
				break;

			case 5:
					r = v;
					g = v * (1 - s);
					b = v * (1 - f * s);
				break;

		}

		this[0] = clamp( r * 256 );
		this[1] = clamp( g * 256 );
		this[2] = clamp( b * 256 );
		
		return this;
		
	}

	
	/* */
	
	getBytesLE() {
		
		let [ r, g, b, a ] = this;
		
		return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
		
	}
	
	getBytesBE() {
		
		let [ r, g, b, a ] = this;
		
		return ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
		
	}
	
	getBytesME() {
		
		let [ r, g, b, a ] = this;
		
		return ((g << 24) | (r << 16) | (a << 8) | b) >>> 0;
		
	}
	
	//	getBytes() {}
	
	static FromByteLE( input ) {
		
		return new Color( input&0xff, (input>>8)&0xff, (input>>16)&0xff, (input>>24)&0xff )
		
	}
	
	static FromByteBE( input ) {
		
		return new Color( (input>>24)&0xff, (input>>16)&0xff, (input>>8)&0xff, input&0xff )
		
	}
	
	static FromByteME( input ) {
		
		return new Color( (input>>16)&0xff, (input>>24)&0xff, input&0xff, (input>>8)&0xff )
		
	}
	
	//	static FromByte() {}
	
	/* */
	
	/** Hex
	 *	
	 *	Inicia uma cor, apartir de uma notação hexadecimal.
	 *	
	 *	@param {Number} input
	 */
	static Hex( input ) {
		
		return new Color( (input>>16)&0xff, (input>>8)&0xff, input&0xff );
		
	}
	
	/** Random
	 *	
	 *	@param {Number} min
	 *	@param {Number} max
	 */
	static Random( min = 35, max = 220 ) {
		
		return new Color(
			Math.floor( Math.random() * max + min ), 
			Math.floor( Math.random() * max + min ), 
			Math.floor( Math.random() * max + min )
		);
		
	}
	
}

/// Atenção: Dispositivos podem divergir no gerenciamento da
/// memoria de modo que altera a ordem de leitura e escrita.
/// Então, aqui identificamos a ordem dos bytes em um buffer (Endianess)
/// e definimos o padrão de leitura correto.
/// Se for manipular diretamente em buffer, utilize os metodos
/// Color.FromByte( <integer> ) e <Color>.getByte para interpretar
/// os canais de cada cor corretamente.
switch( Device.GetEndianness() ) {
	
	case Device.BIG_ENDIAN:
		Color.FromByte = Color.FromByteBE;
		Color.prototype.getBytes = Color.prototype.getBytesBE;
		break;
	
	case Device.MIXED_ENDIAN:
		Color.FromByte = Color.FromByteME;
		Color.prototype.getBytes = Color.prototype.getBytesME;
		break;
	
	default:
	case Device.LITTLE_ENDIAN:
		Color.FromByte = Color.FromByteLE;
		Color.prototype.getBytes = Color.prototype.getBytesLE;
		break;
	
}

/** Matrix
 *	
 */
class Matrix extends Float32Array {
	
	/** 
	 *	
	 *	@param {Number} w		columns
	 *	@param {Number} h		rows
	 *	@param {Array} data
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
		
		return new Matrix( w, h ).fill( 1 );
		
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
			throw new Error("Matrix.Radial: not works with even numbers");
		
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

//import { wasm } from './optimizer.mjs'

/** ColorImageData
 *	
 */
class ColorImageData extends ImageData {
	
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
	
	/// channels
	static R = 0;
	static G = 1;
	static B = 2;
	static A = 3;
	
	/** getChannel
	 *	
	 *	@param {Number} channel		R:0 | G:1 | B:2 | A:0
	 */
	getChannel( channel ) {
		
		if( !channel ) channel = ColorImageData.R;
		
		let { data, width, height } = this;
		
		let output = new Uint8ClampedArray( width * height );
		
		for( let i = 0; i < output.length; i++ )
			output[i] = data[ i*4 + channel ];
		
		return output;
		
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
		let inBuffer = this.data32;
		
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
	 *	Ooperação de convolução utilizando os 3 canais de uma imagem.
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
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let vr = 0;
				let vg = 0;
				let vb = 0;

				for( let i = 0; i < mh; i++ ) {
					for( let j = 0; j < mw; j++ ) {
						
						/// ignore if value equal a zero
						if( matrix[ i*mw + j ] == 1 ) {
						
							let n = 4 * ( width*( y + i ) + x + j );
							
							if( source[n  ] > vr ) vr = source[n  ];
							if( source[n+1] > vg ) vg = source[n+1];
							if( source[n+2] > vb ) vb = source[n+2];
						
						}
						
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
		
		for( let y = 0; y < height; y++ ) {
			
			let offset_row = y * width;
			
			for( let x = 0; x < width; x++ ) {

				let vr = 255;
				let vg = 255;
				let vb = 255;

				for( let i = 0; i < mh; i++ ) {
					for( let j = 0; j < mw; j++ ) {
						
						/// ignore if value equal a zero
						if( matrix[ i*mw + j ] == 1 ) {
						
							let n = 4 * ( width*( y + i ) + x + j );

							if( source[n  ] < vr ) vr = source[n  ];
							if( source[n+1] < vg ) vg = source[n+1];
							if( source[n+2] < vb ) vb = source[n+2];
						
						}
						
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
	
	
	/// 
	
	
}

//import { wasm } from './optimizer.mjs'

/** GrayImageData
 *	
 */
class GrayImageData {
	
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
	
}

/**	BinaryImageData
 *	
 *	@ref Rafael C. Gonzalez; Richard E. Woods. **Digital Image Processing**. Fourth Edition. Pearson Education. 2018.
 *	
 */
class BinaryImageData {
	
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
	
	/** getChannel
	 *	
	 *	@return {Uint8Array}
	 */
	getChannel() {
		
		let w = this.width;
		let h = this.height;
		let indata = this.data;
		
		let output = new Uint8ClampedArray( w * h );
		
		let byteStep = Math.ceil( w/8 );
		
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
					
					output[ offset + wi ] = ((b >> (7-n)) & 1) > 0? 0xff : 0x00;
					
				}
				
			}
		}
		
		return output;
		
	}
	
	
	/** getImageData
	 *	
	 *	@return {ImageData}
	 */
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
		
		this.data;
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

/** RLETrace
 *	
 */
class RLETrace {
	
	constructor( xa, xb, y, id = -1 ) {
		
		this.xa = xa;
		this.xb = xb;
		this.y = y;
		
		this.id = id;
		
	}
	
	get x() { return this.xa }
	get width() { return this.xb - this.xa }
	
	isConnect( t ) {
		
		return  (inRange(this.xa, t.xa, t.xb)) ||
				(inRange(this.xb, t.xa, t.xb)) ||
				(inRange(t.xa, this.xa, this.xb)) ||
				(inRange(t.xb, this.xa, this.xb))
	
	}
	
}

/** distance
 *	
 *	Calcula a distancia dos objetos com base no centro
 *	
 *	@param {Bounds} a
 *	@param {Bounds} b
 */
function distance( a, b ) {
	
	let dx = (a.x + a.width/2) - (b.x + b.width/2),
		dy = (a.y + a.height/2) - (b.y + b.height/2);
	
	return Math.hypot( dx, dy );
	
}

///
///
///

/** getLinesFromGrayImageData
 *	
 *	@param {GrayImageData} imagedata
 *	@return {Array[][]} 				[ [ RLETrace, ... ], ... ]
 */
function getLinesFromGrayImageData( grayImageData ) {
	
	const { width, height, data } = grayImageData;
	
	let lines = new Array();
	
	let w = width - 1,
		h = height - 1;
	
	for( let y = 0; y < h; y++ ) {
		
		let offset = y * width;
		
		let line = new Array(),
			xi = 0;
		
		do {
			
			while( xi < width && data[ offset + xi ] == 0 ) xi++;
			
			if( xi == width ) break;
			
			if( xi == w ) {
				line.push( new RLETrace( xi, xi, y ) );
				break;
			}
			
			let xf = xi + 1;
			
			while( xf < width && data[ offset + xf ] > 0 ) xf++;
			
			xf--;
			
			line.push( new RLETrace( xi, xf, y ) );
			
			xi = xf + 1;
			
		} while( xi < width );
		
		lines.push( line );
		
	}
	
	return lines;
	
}

/** replaceTraceId
 *		
 *	Changes all RLETrace equal `fromId` to `toId`.
 *		
 *	@param {Array[][]} lines			from `getLinesFrom`
 *	@param {Number} fromId				RLETrace ID
 *	@param {Number} toId				RLETrace ID
 */
function replaceTraceId( lines, fromId, toId ) {
	
	for( let traces of lines )
		for( let trace of traces ) 
			if( trace.id == fromId ) trace.id = toId;	
		
}

/** connectTraces
 *	
 *	@param {Array[][]}	lines			from `getLinesFrom`
 *	@return {Array[][]} lines
 */
function connectTraces( lines ) {
	
	let count = 0;
	let ymax = lines.length - 1;
	
	/// para cada linha
	for( let y = 0; y < ymax; y++ ) {
		
		let line = lines[ y ];
		
		/// para cada elemento
		for( let e of line ) {
		
			if( e.id == -1 ) e.id = count++;
			
			/// connect next lines
			let next_line = lines[ y + 1 ];
			
			for( let ne of next_line ) {
			
				if( e.isConnect( ne ) ) {
					if( ne.id == -1 ) {
					
						ne.id = e.id;
						
					} else if( ne.id != e.id ) {
						
						replaceTraceId( lines, ne.id, e.id );
						
					}
				}
				
			}
			
		}
	}
	
	return lines;
	
}

///
///
///

const directions = [
	new Point( 0, 1),
	new Point( 1, 1),
	new Point( 1, 0),
	new Point( 1,-1),
	new Point( 0,-1),
	new Point(-1,-1),
	new Point(-1, 0),
	new Point(-1, 1) 
];

/** connectPoints
 *	
 *	@param {Array} points		[Point, Point, ...]
 *	@return {Array}
 */
function connectPoints( points ) {
	
	for( let i = 0; i < points.length; i++ ) {
		
		let pa = points[i];
			pa.links = new Object();
		
		for( let k = 0; k < directions.length; k++ ) {
			
			let dir = directions[k];
			let next = new Point( pa.x + dir.x, pa.y + dir.y );
			
			for( let j = 0; j < points.length; j++ ) {
				
				let pb = points[j];
				
				if( next.equals( pb ) )
					pa.links[k] = j;
				
			}
			
		}
	}
	
	///
	let index = [];
	let stack = [{ point: points[0], dir: 0, offset: 0 }];

	while( stack.length > 0 ) {
		
		let { point, dir, offset } = stack[stack.length - 1];
		let found = false;

		for( let k = offset; k < directions.length; k++ ) {
			
			let n = (dir + k) % directions.length;

			if( n in point.links ) {
				
				let i = point.links[n];

				if( !index.includes(i) ) {
					
					index.push(i);
					stack[stack.length - 1].offset = k + 1;
					stack.push({ point: points[i], dir: n, offset: 0 });
					
					found = true;
					break;
					
				}
			}
			
		}
		
		if( !found ) stack.pop();
		
	}

	
	
	points = index.map(function(i) {
		
		let p = points[i];
		
		delete p.links;
		
		return p;
		
	});
	
	/**/
	
	/// remove conexões muito distantes
	for( let i = 1; i < points.length; i++ ) {
			
		let a = points[i-1];
		let b = points[i];
		
		if( a.distance(b) > 10 )
			points.splice( i--, 1 );
		
	}
	
	/// otimiza conexões
	for( let i = 1; i < points.length; i++ ) {
			
		let a = points[i-1];
		let b = points[i];
		
		if( a.x == b.x || a.y == b.y )
			points.splice( i--, 1 );
		
	}
	
	/**/
	
	return points;
	
	
}

/** RLEObject
 *	
 */
class RLEObject {

	constructor( id ) {
		
		this.left = Number.MAX_SAFE_INTEGER;
		this.top = Number.MAX_SAFE_INTEGER;
		this.right = 0;
		this.bottom = 0;
		
		this.id = id;
		this.data = new Object();
		this.color = Color.Random();
		this.pixels = 0;
		
	}
	
	get x() { return this.left }
	get y() { return this.top }
	
	get width() { return this.right - this.left }
	get height() { return this.bottom - this.top }
	
	insideOf( object ) {
		
		return 	inRange( this.left,   object.left, object.right ) &&
				inRange( this.right,  object.left, object.right ) &&
				inRange( this.top,    object.top,  object.bottom ) &&
				inRange( this.bottom, object.top,  object.bottom )
	
	}
	
	/** append
	 *	
	 *	@param {Trace} 			arguments[]
	 */
	append() {
		
		for( let trace of arguments ) {
		
			this.left   = Math.min( this.left, trace.xa );
			this.right  = Math.max( this.right, trace.xb );
			this.top    = Math.min( this.top, trace.y );
			this.bottom = Math.max( this.bottom, trace.y );
			
			this.pixels += trace.xb - trace.xa;
			
			if( !(trace.y in this.data) )
				this.data[ trace.y ] = new Array();
			
			this.data[ trace.y ].push( trace );
			
		}
		
	}
	
	update() {
		
		let data = this.data;
		
		/// junta as linhas que estão conectas na horizotal
		for( let y in data ) {
			
			let traces = data[y].sort(function(a, b){ return a.xa - b.xa });
			
			for( let i = 1; i < traces.length; i++ ) {
				
				let a = traces[ i-1 ],
					b = traces[ i ];
				
				if( a.xb >= b.xa ) {
					a.xb = b.xb;
					traces.splice( i--, 1 );
				}
				
			}
			
		}
		
		
		/// calcula a area
		let pixels = 0;
		
		for( let y in data )
			for( let trace of data[y] )
				pixels += trace.xb - trace.xa;
		
		///
		this.pixels = pixels;
		
	}
	
	
	/* */
	
	close() {
		
		let data = this.data;
		
		/// encontra os {Trace} vazios
		let lines = new Array();
		
		for( let y = this.top; y < this.bottom; y++ ) {
			
			/// linha atual
			let line = data[ y ].sort(function(a, b){ return a.xa - b.xa });
			
			/// buracos encontrados na linha atual
			let hline = new Array();
			
			for( let i = 0, n = line.length - 1; i < n; i++ )
				hline.push( new RLETrace( line[ i ].xb, line[ i+1 ].xa, y ) );
			
			/// havera 
			lines.push( hline );
			
		}
		
		/// conecta os {Trace}
		connectTraces( lines );
		
		/// separa os traços dos buracos por ID
		let holes = new Object();
		
		for( let line of lines ) {
			for( let trace of line ) {
				
				let id = trace.id;
				
				if( !(id in holes) ) 
					holes[ id ] = new RLEObject( id );
				
				holes[ id ].append( trace );
				
			}
		}
		
		for( let id in holes ) {
			
			let h = holes[ id ];
			
			let top_connected = false,
				bottom_connected = false;
			
			let ty = h.top - 1, /// proxima linha do topo do objeto
				by = h.bottom + 1; /// proxima linha do fundo do objeto
		
			if( data[ ty ] && data[ by ] ) {
				
				for( let a of h.data[ h.top ] ) {
					for( let b of data[ ty ] ) {
						if( a.isConnect( b ) ) {
							top_connected = true;
							break;
						}
					}
					
					if( top_connected ) break;
					
				}
				
				for( var a of h.data[ h.bottom ] ) {
					for( var b of data[ by ] ) {
						if( a.isConnect( b ) ) {
							bottom_connected = true;
							break;
						}
					}
					
					if( bottom_connected ) break;
					
				}
				
			}
			
			if( top_connected && bottom_connected )
				for( let y in h.data )
					data[ y ].push( ...h.data[y] );
			
		}
		
		this.update();
	
	}
	
	/* */
	
	scan( handler ) {
		
		let data = this.data;
		
		for( let yi in data ) {
			
			let y = parseInt(yi);
			
			for( let trace of data[yi] ) {
				
				for( let x = trace.xa; x < trace.xb; x++ )
					handler( x, y );
				
			}
		}
		
	}
	
	/* */
	
	getBorderData() {
		
		/// if already processed
		if( this.boderData )
			return this.boderData;
		
		///
		let data = this.data;
		let points = new Array();
		
		for( let iy in data ) {
			
			let y = parseInt(iy);
			
			let top = data[ y-1 ];
			let bottom = data[ y+1 ];
			
			for( let trace of data[iy] ) {
				
				if( !top ) {
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						points.push(new Point( x, y ));
					
				} else if( !bottom ) {
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						points.push(new Point( x, y ));
					
				} else {
					
					points.push(new Point( trace.xa, y ));
					points.push(new Point( trace.xb, y ));
					
					for( let x = trace.xa+1, xo = trace.xb-1; x <= xo; x++ ) {
						
						let connect_up = false;
						let connect_down = false;
						
						for( let t of top ) {
							if( x >= t.xa && x <= t.xb ) {
								connect_up = true;
								break;
							}
						}
						
						for( let t of bottom ) {
							if( x >= t.xa && x <= t.xb ) {
								connect_down = true;
								break;
							}
						}
						
						if( !(connect_up && connect_down) )
							points.push(new Point( x, y ));
						
					}
					
				}
				
			}
		
		}
		
		///
		///
		let dx = 0;
		let dy = 0;
		
		for( let p of points ) {
			dx += p.x;
			dy += p.y;
		}
		
		
		let center = new Point( 0, 0 );
		
		if( points.length > 0 ) {
			center.x = Math.floor( dx/points.length );
			center.y = Math.floor( dy/points.length );
		}
		
		let distAverage = 0;
		
		for( let p of points ) {
			
			p.dist = p.distance( center );
			distAverage += p.dist;
			
		}
		
		if( points.length > 0 )
			distAverage = distAverage/points.length;
		
		let near = points[0];
		let far = points[0];
		
		/// Standard deviation of distances
		let distDeviation = 0;
		
		for( let p of points ) {
			
			if( p.dist < near.dist ) near = p;
			if( p.dist > far.dist ) far = p;
			
			distDeviation += Math.pow( p.dist - distAverage, 2 );
			
		}
		
		if( points.length > 1 )
			distDeviation = distDeviation/(points.length-1);
		
		distDeviation = Math.sqrt( distDeviation );
		
		///
		///
		points = connectPoints( points );
		
		return this.boderData = { points, center, near, far, distAverage, distDeviation };
		
	}
	
}

/** RLESegmentation
 *	
 */
class RLESegmentation {
	
	/** 
	 *	
	 *	@param  {GrayImageData} input
	 *	@return  {RLESegmentation}
	 */
	constructor( input ) {
		
		/// {Array[][]} lines		[[ {RLETrace}, ... ], ...]
		let lines = getLinesFromGrayImageData( input );
		
		///
		connectTraces( lines );
		
		///
		for( let line of lines ) {
			for( let trace of line ) {
				
				let id = trace.id;
				
				if( !(id in this) ) 
					this[ id ] = new RLEObject( id );
				
				this[ id ].append( trace );
				
			}
		}
		
	}
	
	get length() { return Object.keys( this ).length }
	
	/** 
	 *	
	 */
	close() {
		
		for( let id in this ) 
			this[ id ].close();
		
	}
	
	/** filter
	 *	
	 *	@param {Function} statement
	 */
	filter( statement ) {
		
		for( let id in this ) 
			if( statement( this[ id ] ) ) 
				delete this[ id ];
		
	}
	
	merge( delta ) {
		
		let objects = this;
		
		let keys = Object.keys( this );
			keys.sort(function(a, b){ return objects[b].pixels - objects[a].pixels });
		
		for( let i = 0; i < keys.length; i++ ) {
			
			let target = this[ keys[i] ];
			
			for( let j = i+1; j < keys.length; j++ ) {
				
				let object = this[ keys[j] ];
				
				if( object.insideOf( target ) ) {
					if( distance( target, object ) <= delta ) {
						
						for( let y in object.data ) 
							target.append( ...object.data[y] );
						
						delete this[ keys[j] ];
						
						keys.splice( j--, 1 );
						
					}
				}
				
			}
		}
		
	}
	
	/** debug
	 *	
	 *	@param {ImageData} imagedata
	 */
	debug( imagedata ) {
		
		let width = imagedata.width;
		let buffer = new Uint32Array( imagedata.data.buffer );
		
		for( let id in this ) {
			
			/// RLEObject
			let object = this[ id ];
			
			let data = object.data;
			let color = object.color.getBytes();
			
			for( let y in data ) {
				for( let trace of data[ y ] ) {
					
					let offset = trace.y * width;
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						buffer[ offset + x ] = color;
					
				}
			}
			
		}
		
	}
	
	[Symbol.iterator]() {
		
		let objects = this;
	
		let keys = Object.keys( objects );
		let i = 0;
		
		return {
			next() {
				
				if( i < keys.length ) 
					return { value: objects[ keys[ i++ ] ], done: false };
			
				return { done: true };
				
			}
		}
		
	}
	
}

///
///
///

/** Load
 *	
 *	@param {String} path
 *	@param {Function} handlerCallback
 */
function Load( path, handlerCallback ) {
	
	var source = new Image();
	
	source.onload = function() {
		
		const context = CreateContext( source );
		const imagedata = context.getImageData(0,0,source.width, source.height);
		
		/// extends to RGBAImageData
		ColorImageData.Extends( imagedata );
		
		///
		handlerCallback( imagedata, context );
		
	};
	
	source.src = path;
		
}

/** CreateContext
 *	
 *	@param {Image|HTMLCanvasElement|ImageData} source
 *	@param {HTMLElement} parentNode
 *	@return {CanvasRenderingContext2D}
 */
function CreateContext( source, parentNode = null ) {
	
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
	
	if( parentNode instanceof HTMLElement )
		parentNode.appendChild( canvas );
	
	///
	return context;
	
}

///
export default {
	
	Load,
	CreateContext,
	
	Rect,
	Point,
	Color,
	Matrix,
	
	ColorImageData,
	GrayImageData,
	BinaryImageData,

	RLESegmentation
	
};

