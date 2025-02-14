
import Device from './Device.mjs';

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
	
	set r( v ) { this[0] = Math.min(255,Math.max(0, v)) }
	set g( v ) { this[1] = Math.min(255,Math.max(0, v)) }
	set b( v ) { this[2] = Math.min(255,Math.max(0, v)) }
	set a( v ) { this[3] = Math.min(255,Math.max(0, v)) }
	
	get hex() {
		
		let [ r, g, b ] = this;
		
		return ((r << 16) | (g << 8) | b) >>> 0;
		
	}
	
	/* */
	
	/** Hex
	 *	
	 *	Inicia uma cor, apartir de uma notação hexadecimal.
	 *	
	 */
	static Hex( input ) {
		
		return new Color( (input>>16)&0xff, (input>>8)&0xff, input&0xff );
		
	}
	
	/** Random
	 *	
	 */
	static Random( min = 35, max = 220 ) {
		
		return new Color(
			Math.floor( Math.random() * max + min ), 
			Math.floor( Math.random() * max + min ), 
			Math.floor( Math.random() * max + min )
		);
		
	}
	
	/* */
	
	inverse() {

		this[0] = 255 - this[0];
		this[1] = 255 - this[1];
		this[2] = 255 - this[2];

		return this;

	}
	
	/** gray
	 *	
	 *	BT.601-7
	 *	@ref https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
	 *	
	 */
	gray() {
		
		let [ r, g, b ] = this;
		
		let s = Math.floor( 0.2989 * r + 0.5870 * g + 0.1140 * b );

		this[0] = s;
		this[1] = s;
		this[2] = s;

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
	
	toString() { 
		
		return '#'+ this.hex.toString(16).toUpperCase().padStart(6,'0')
	
	}
	
}

/// Atenção: Dispositivos podem divergir no gerenciamento da
/// memoria de modo que altera a ordem de leitura e escrita.
/// Então, aqui identificamos a ordem dos bytes em um buffer (Endianess)
/// e definimos o padrão de leitura correto.
/// Se for manipular diretamente em buffer, utilize os metodos
/// Color.FromByte( <integer> ) e <Color>.getByte para interpretar
/// os canais de cada cor corretamente.
switch( Device.GetByteOrder() ) {
	
	case Device.BYTE_ORDER_BE:
		Color.FromByte = Color.FromByteBE;
		Color.prototype.getBytes = Color.prototype.getBytesBE;
		break;
	
	case Device.BYTE_ORDER_ME:
		Color.FromByte = Color.FromByteME;
		Color.prototype.getBytes = Color.prototype.getBytesME;
		break;
	
	default:
	case Device.BYTE_ORDER_LE:
		Color.FromByte = Color.FromByteLE;
		Color.prototype.getBytes = Color.prototype.getBytesLE;
		break;
	
}

