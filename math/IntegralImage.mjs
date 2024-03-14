
/**	IntegralImage
 *	
 *	@ref https://levelup.gitconnected.com/the-integral-image-4df3df5dce35
 *	
 *	
 *	MAX: 4,294,967,295 (0xFFFFFFFF)
 *	
 */
export default class IntegralImage extends Uint32Array {
	
	constructor( width, height, data ) {
		
		super( width * height );
		
		this.width = width;
		this.height = height;
		
		
		if( data && data.length == this.length ) {
			
			/// prepara o primeiro elemento
			this[0] = data[0];
			
			/// prepara a primeira linha
			for( let x = 1; x < width; x++ ) 
				this[x] = data[x] + this[x-1];
			
			/// monta matriz
			for( let y = 1; y < height; y++ ) {
				
				let offset = y * width;
				
				this[ offset ] = data[ offset ] + this[ offset-width ];
				
				for( let x = 1; x < width; x++ ) {
					
					let k = offset + x;
					
					this[ k ] = data[ k ] + this[ k - width ] + (this[ k-1 ] - this[ (k-1) - width ]);
					
				}
			}
			
		}
		
	}
	
	at( x, y ) {
		
		return this[ y * this.width + x ];
		
	}
	
	getArea( x, y, w, h ) {
		
		/// retorna um passo
		x--;
		y--;
		
		let yoffset = h * this.width;
		
		let a = y * this.width + x,
			b = a + w,
			c = a + yoffset,
			d = b + yoffset;
		
		return this[ d ] - this[ b ] - this[ c ] + this[ a ];
		
	}
	
	
	toImageData() {
		
		let output = new ImageData( this.width, this.height );
		let data = output.data;
		
		let max = Math.max.apply( null, this );
	
		for( let i = 0; i < this.length; i++ ) {
			
			let v = Math.floor( 255 * (this[i] / max) );
			let k = i * 4;
			
			data[ k++ ] = v;
			data[ k++ ] = v;
			data[ k++ ] = v;
			data[ k++ ] = 255;
			
		}
		
		return output;
		
	}
	
	
//	getAreaFromCoords( a, b, c, d ) {
//		
//		
//		
//	}
	
}