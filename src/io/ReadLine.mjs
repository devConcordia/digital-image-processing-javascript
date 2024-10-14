

/** ReadLine
 *	
 *	@param {ImageData} input
 *	@param {Number} ax
 *	@param {Number} ay
 *	@param {Number} bx
 *	@param {Number} by
 *	@return {Uint8Array} [ R, G, B, A, R, G, ... ] 
 */
export default function ReadLine( input, ax, ay, bx, by ) {
	
	const { data, width } = input;
	
	let dx = bx - ax,
		dy = by - ay;
	
	let length = Math.hypot( dx, dy );
	
	let stepx = dx / length,
		stepy = dy / length;
		
	if( stepx == Infinity || stepx == -Infinity ) stepx = 0;
	if( stepy == Infinity || stepy == -Infinity ) stepy = 0;
	
	let output = new Uint8Array( length * 4 );
	
	for( let k = 0; k < length; k+=4 ) {
		
		let n = k/4;
		
		let x = Math.round( ax + n * stepx ),
			y = Math.round( ay + n * stepy );
		
		let i = (y * width + x) * 4;
		
		output[ k   ] = data[ i++ ];
		output[ k+1 ] = data[ i++ ];
		output[ k+2 ] = data[ i++ ];
		output[ k+3 ] = data[ i++ ];
		
	}

	return output;

}
