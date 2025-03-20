
import Point from "../common/Point.mjs";
import RLETrace from './RLETrace.mjs';

/** distance
 *	
 *	Calcula a distancia dos objetos com base no centro
 *	
 *	@param {Bounds} a
 *	@param {Bounds} b
 */
export function distance( a, b ) {
	
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
export function getLinesFromGrayImageData( grayImageData ) {
	
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
export function connectTraces( lines ) {
	
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
export function connectPoints( points ) {
	
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



