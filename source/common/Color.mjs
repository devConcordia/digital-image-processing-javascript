
import { clamp } from './utils.mjs';
import Device from './Device.mjs';

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

};


/** Color [ R, G, B, A ]
 *	
 */
export default class Color extends Uint8Array {
	
	constructor( r = 0, g = 0, b = 0, a = 255 ) {
		
		super([ r, g, b, a ]);
		
	}
	
	get r() { return this[0] }
	get g() { return this[1] }
	get b() { return this[2] }
	get a() { return this[3] }
	
	set r( v ) { this[0] = clamp(v) }
	set g( v ) { this[1] = clamp(v) }
	set b( v ) { this[2] = clamp(v) }
	set a( v ) { this[3] = clamp(v) }

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

