
import ImageObjectData from './ImageObjectData.mjs'

import Point from '../core/Point.mjs'
// import { Bounds } from '../Bounds.mjs'

import Trace from './Trace.mjs'

import { lines_connect } from './core.mjs'


function joinVerticalLines( data ) {
	
//	return data;
	
//	console.log( data.length );
	
	let output = [];
	
	let recx = false;
	let recy = false;
	
	let N = data.length;
	let M = N + 1;
	
	for( let i = 0; i < M; i++ ) {
		
		let a = data[ i-1 ] || data[ N-1 ];
		let b = data[ i ] || data[ 0 ];
		
		if( a.y == b.y ) {
			
			if( recy == false )
				output.push( a );
			
			
			recy = true;
			
		} else {
			
			if( recy == true )
				output.push( a );
			
			recy = false;
			
		}
		
		if( a.x == b.x ) {
			
			if( recx == false )
				output.push( a );
			
			recx = true;
			
		} else {
			
			if( recx == true )
				output.push( a );
			
			recx = false;
			
		}
		
		
		
		
	}
	
//	console.log( output.length );
//	console.log( '' );
	
	return output;
	
}


/** ImageObject
 *	
 */
export default class ImageObject extends ImageObjectData {
	
	close() {
		
		var traces = this.traces;
		
		/// encontra os {Trace} vazios
		var lines = new Array();
		
		for( var y = this.top; y < this.bottom; y++ ) {
			
			/// linha atual
			var line = traces[ y ].sort(function(a, b){ return a.x1 - b.x1 });
			
			/// buracos encontrados na linha atual
			var hline = new Array();
			
			for( var i = 0, n = line.length - 1; i < n; i++ )
				hline.push( new Trace( line[ i ].x2, line[ i+1 ].x1, y ) );
			
			/// havera 
			lines.push( hline );
			
		}
		
		/// conecta os {Trace}
		lines_connect( lines );
		
		
		
		
		/// separa os traços dos buracos por ID
		var holes = new Map();
		
		for( var line of lines ) {
			for( var trace of line ) {
				
				var id = trace.id;
				
				if( !(id in holes) ) holes[ id ] = new ImageObjectData( id );
				
				holes[ id ].append( trace );
				
			}
		}
		
		for( var id in holes ) {
			
			var h = holes[ id ];
			
			var top_connected = false,
				bottom_connected = false;
			
			var ty = h.top - 1, /// proxima linha do topo do objeto
				by = h.bottom + 1; /// proxima linha do fundo do objeto
		
			if( traces[ ty ] && traces[ by ] ) {
				
				for( var a of h.traces[ h.top ] ) {
					for( var b of traces[ ty ] ) {
						if( a.isConnect( b ) ) {
							top_connected = true;
							break;
						}
					}
					
					if( top_connected ) break;
					
				}
				
				for( var a of h.traces[ h.bottom ] ) {
					for( var b of traces[ by ] ) {
						if( a.isConnect( b ) ) {
							bottom_connected = true;
							break;
						}
					}
					
					if( bottom_connected ) break;
					
				}
				
			}
			
			if( top_connected && bottom_connected )
				for( var y in h.traces )
					traces[ y ].push( ...h.traces[y] );
			
		}
		
		this.update();
		
	}
	
	vectorize() {
		
		var points = new Map();
		
		for( var y in this.traces ) {
			
			points[y] = [];
			
			for( var trace of this.traces[y] ) {
				
				var a = new Point( trace.x1, y );
				var b = new Point( trace.x2, y );
				
				points[y].push( a, b );
				
			}
		}
		
		///
		var target = points[ this.top ].pop();
		
		var path = new Array( target );
		
		for( var y = this.top; y < this.bottom; ) {
			
			var linea = points[ y-1 ] || [];
			var lineb = points[ y   ] || [];
			var linec = points[ y+1 ] || [];
			
			var where = '';
			var index = 0;
			var nexty = y + 1;
			var point = null;
			var delta = Number.MAX_SAFE_INTEGER;
			
			
			for( var i = 0; i < lineb.length; i++ ) {
				var d = lineb[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = lineb[i];
					nexty = y;
					index = i;
					where = 'b';
				}
			}
			
			for( var i = 0; i < linea.length; i++ ) {
				var d = linea[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = linea[i];
					nexty = y - 1;
					index = i;
					where = 'a';
				}
			}
			
			for( var i = 0; i < linec.length; i++ ) {
				var d = linec[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = linec[i];
					nexty = y + 1;
					index = i;
					where = 'c';
				}
			}
			
			y = nexty;
				
			if( point ) {
				
				path.push( point );
				
				target = point;
				
				if( where == 'a' ) {
					
					linea.splice( index, 1 );
					
				} else if( where == 'b' ) {
					
					lineb.splice( index, 1 );
					
				} else if( where == 'c' ) {
					
					linec.splice( index, 1 );
					
				}

			}
			
		}
		
		if( !target ) return joinVerticalLines( path );
		
		for( var y = this.bottom; y > this.top; ) {
			
			var linea = points[ y-1 ] || [];
			var lineb = points[ y   ] || [];
			var linec = points[ y+1 ] || [];
			
			var where = '';
			var index = 0;
			var nexty = y - 1;
			var point = null;
			var delta = Number.MAX_SAFE_INTEGER;
			
			
			for( var i = 0; i < lineb.length; i++ ) {
				var d = lineb[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = lineb[i];
					nexty = y;
					index = i;
					where = 'b';
				}
			}
			
			for( var i = 0; i < linea.length; i++ ) {
				var d = linea[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = linea[i];
					nexty = y - 1;
					index = i;
					where = 'a';
				}
			}
			
			for( var i = 0; i < linec.length; i++ ) {
				var d = linec[i].distance( target );
				if( d <= delta ) {
					delta = d;
					point = linec[i];
					nexty = y + 1;
					index = i;
					where = 'c';
				}
			}
			
			y = nexty;
			
			if( point ) {
				
				path.push( point );
				
				target = point;
				
				
				if( where == 'a' ) {
					
					linea.splice( index, 1 );
					
				} else if( where == 'b' ) {
					
					lineb.splice( index, 1 );
					
				} else if( where == 'c' ) {
					
					linec.splice( index, 1 );
					
				}

			}
			
		}
		
		return joinVerticalLines( path );
		
	}
	
/*	skeleton() {
		
		let output = new Array();
		
		let traces = this.traces;
		
		for( let y in traces ) {
			
			let line = traces[ y ];
			
			for( let trace of line ) {
				
				let x = trace.x + trace.width/2;
				
				output.push( new Point( x, y ) );
				
			}
			
			
			for( let y1 = y+1;  )
				
			
		}
		
		
		
		return output;
		
	}
/**/	

}
