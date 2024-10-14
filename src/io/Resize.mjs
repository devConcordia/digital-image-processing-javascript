

/** Resize
 *	
 *	@param {ImageData} input
 *	@param {Number} sx
 *	@param {Number} sy
 *	@return {ImageData}
 */
export default function Resize( input, sx = 1, sy = sx ) {
		
	let width = input.width, 
		height = input.height;
	
	let w = Math.floor( width * sx ),
		h = Math.floor( height * sy );
		
	let in_data = input.data;
	
	let output = new ImageData( w, h );
	let out_data = output.data;
	
	for( let y = 0; y < h; y++ ) {
		
		/// offset input
		let offset_i = width * Math.floor(y/sy);
		
		/// offset output
		let offset_o = w * y;
		
		///
		for( let x = 0; x < w; x++ ) {
			
			let i = (offset_i + Math.floor(x/sx)) * 4;
			let j = (offset_o + x) * 4;
			
			out_data[ j   ] = in_data[ i   ];
			out_data[ j+1 ] = in_data[ i+1 ];
			out_data[ j+2 ] = in_data[ i+2 ];
			out_data[ j+3 ] = in_data[ i+3 ];
			
		}
	}
	
	return output;
	
}
