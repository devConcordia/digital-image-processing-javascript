
/** Matrix
 *	
 *	Outhers:
 *	@ref https://en.wikipedia.org/wiki/Roberts_cross
 *	
 */
export default class Matrix extends Float32Array {
	
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


