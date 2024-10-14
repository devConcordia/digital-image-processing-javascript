
/** WriteLine 
 *	
 *	@param {ImageData} input
 *	@param {Number} ax
 *	@param {Number} ay
 *	@param {Number} bx
 *	@param {Number} by
 *	@param {Number} r
 *	@param {Number} g
 *	@param {Number} b
 *	@param {Number} a 				Default: 255
 */
export default function WriteLine( input, ax, ay, bx, by, r, g, b, a = 255 ) {
	
	const { data, width, height } = input;
	
	let dx = bx - ax,
		dy = by - ay;
	
	let length = Math.round( Math.hypot( dx, dy ) );
	
	let stepx = dx / length,
		stepy = dy / length;
		
	if( stepx == Infinity || stepx == -Infinity ) stepx = 0;
	if( stepy == Infinity || stepy == -Infinity ) stepy = 0;
	
	for( let k = 0; k < length; k++ ) {
		
		let x = Math.round( ax + k * stepx ),
			y = Math.round( ay + k * stepy );
		
		if( x < 0 || x > width || y < 0 || y > height ) continue;
		
		let i = ( y * width + x ) * 4;
		
		data[ i   ] = r;
		data[ i+1 ] = g;
		data[ i+2 ] = b;
		data[ i+3 ] = a;
		
	}
	
}
