
import Trace from './Trace.mjs'



/** 
 *
 */
function lines_scan({ width, height, data }) {
	
	var lines = new Array();
	
	var w = width - 1,
		h = height - 1;
	
	for( var y = 0; y < h; y++ ) {
		
		var offset = y * width;
		
		var line = new Array(),
			xi = 0;
		
		do {
			
			while( xi < width && data[ (offset + xi) * 4 ] == 0 ) xi++;
			
			if( xi == width ) break;
			
			if( xi == w ) {
				line.push( new Trace( xi, xi, y ) );
				break;
			}
			
			var xf = xi + 1;
			
			while( xf < width && data[ (offset + xf) * 4 ] > 0 ) xf++;
			
			xf--;
			
			line.push( new Trace( xi, xf, y ) );
			
			xi = xf + 1;
			
		} while( xi < width );
		
		lines.push( line );
		
	}
	
	return lines;
	
}

/** 
 *
 */
function lines_replace_id( lines, from, to ) {
	
	for( var ln of lines )
		for( var e of ln ) if( e.id == from ) e.id = to;	
		
}

/** lines_connect
 *	
 *	@param {Array[][]}	lines
 */
function lines_connect( lines ) {
	
	var count = 0;
	
	var ymax = lines.length - 1;
	
	/// para cada linha
	for( var y = 0; y < ymax; y++ ) {
		
		var line = lines[ y ];
		
		/// para cada elemento
		for( var e of line ) {
		
			if( e.id == -1 ) e.id = count++;
			
			/// connect next lines
			var next_line = lines[ y + 1 ];
			
			for( var ne of next_line ) {
			
				if( e.isConnect( ne ) ) {
					if( ne.id == -1 ) {
					
						ne.id = e.id;
						
					} else if( ne.id != e.id ) {
						
						lines_replace_id( lines, ne.id, e.id );
						
					}
				}
				
			}
			
		}
	}
	
	return lines;
	
}


export { lines_scan, lines_connect }
