
/** Crop
 *	
 */
export default function Crop({ data, width, height }, sx, sy, sw, sh ) {
	
	var output = new ImageData( sw, sh ),
		out_data = output.data;
	
	for( var y = 0; y < sh; y++ ) {
		
		var offset1 = (sy + y) * width;
		var offset2 = y * sw;
		
		for( var x = 0; x < sw; x++ ) {
			
			var i = (offset1 + (sx + x)) * 4;
			var j = (offset2 + x) * 4;
			
			out_data[ j   ] = data[ i   ];
			out_data[ j+1 ] = data[ i+1 ];
			out_data[ j+2 ] = data[ i+2 ];
			out_data[ j+3 ] = data[ i+3 ];
		
		}
		
	}
	
	return output;
	
}
