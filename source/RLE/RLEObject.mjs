
//import Bounds from '../common/Bounds.mjs';
import Point from '../common/Point.mjs';
import Color from '../common/Color.mjs';

import { inRange } from '../common/utils.mjs';

import RLETrace from './RLETrace.mjs';

import { connectTraces, connectPoints } from './core.mjs';


/** RLEObject
 *	
 */
export default class RLEObject {

	constructor( id ) {
		
		this.left = Number.MAX_SAFE_INTEGER;
		this.top = Number.MAX_SAFE_INTEGER;
		this.right = 0;
		this.bottom = 0;
		
		this.id = id;
		this.data = new Object();
		this.color = Color.Random();
		this.pixels = 0;
		
	}
	
	get x() { return this.left }
	get y() { return this.top }
	
	get width() { return this.right - this.left }
	get height() { return this.bottom - this.top }
	
	insideOf( object ) {
		
		return 	inRange( this.left,   object.left, object.right ) &&
				inRange( this.right,  object.left, object.right ) &&
				inRange( this.top,    object.top,  object.bottom ) &&
				inRange( this.bottom, object.top,  object.bottom )
	
	}
	
	/** append
	 *	
	 *	@param {Trace} 			arguments[]
	 */
	append() {
		
		for( let trace of arguments ) {
		
			this.left   = Math.min( this.left, trace.xa );
			this.right  = Math.max( this.right, trace.xb );
			this.top    = Math.min( this.top, trace.y );
			this.bottom = Math.max( this.bottom, trace.y );
			
			this.pixels += trace.xb - trace.xa;
			
			if( !(trace.y in this.data) )
				this.data[ trace.y ] = new Array();
			
			this.data[ trace.y ].push( trace );
			
		}
		
	}
	
	update() {
		
		let data = this.data;
		
		/// junta as linhas que estão conectas na horizotal
		for( let y in data ) {
			
			let traces = data[y].sort(function(a, b){ return a.xa - b.xa });
			
			for( let i = 1; i < traces.length; i++ ) {
				
				let a = traces[ i-1 ],
					b = traces[ i ];
				
				if( a.xb >= b.xa ) {
					a.xb = b.xb;
					traces.splice( i--, 1 );
				}
				
			}
			
		}
		
		
		/// calcula a area
		let pixels = 0;
		
		for( let y in data )
			for( let trace of data[y] )
				pixels += trace.xb - trace.xa;
		
		///
		this.pixels = pixels;
		
	}
	
	
	/* */
	
	close() {
		
		let data = this.data;
		
		/// encontra os {Trace} vazios
		let lines = new Array();
		
		for( let y = this.top; y < this.bottom; y++ ) {
			
			/// linha atual
			let line = data[ y ].sort(function(a, b){ return a.xa - b.xa });
			
			/// buracos encontrados na linha atual
			let hline = new Array();
			
			for( let i = 0, n = line.length - 1; i < n; i++ )
				hline.push( new RLETrace( line[ i ].xb, line[ i+1 ].xa, y ) );
			
			/// havera 
			lines.push( hline );
			
		}
		
		/// conecta os {Trace}
		connectTraces( lines );
		
		/// separa os traços dos buracos por ID
		let holes = new Object();
		
		for( let line of lines ) {
			for( let trace of line ) {
				
				let id = trace.id;
				
				if( !(id in holes) ) 
					holes[ id ] = new RLEObject( id );
				
				holes[ id ].append( trace );
				
			}
		}
		
		for( let id in holes ) {
			
			let h = holes[ id ];
			
			let top_connected = false,
				bottom_connected = false;
			
			let ty = h.top - 1, /// proxima linha do topo do objeto
				by = h.bottom + 1; /// proxima linha do fundo do objeto
		
			if( data[ ty ] && data[ by ] ) {
				
				for( let a of h.data[ h.top ] ) {
					for( let b of data[ ty ] ) {
						if( a.isConnect( b ) ) {
							top_connected = true;
							break;
						}
					}
					
					if( top_connected ) break;
					
				}
				
				for( var a of h.data[ h.bottom ] ) {
					for( var b of data[ by ] ) {
						if( a.isConnect( b ) ) {
							bottom_connected = true;
							break;
						}
					}
					
					if( bottom_connected ) break;
					
				}
				
			}
			
			if( top_connected && bottom_connected )
				for( let y in h.data )
					data[ y ].push( ...h.data[y] );
			
		}
		
		this.update();
	
	}
	
	/* */
	
	scan( handler ) {
		
		let data = this.data;
		
		for( let yi in data ) {
			
			let y = parseInt(yi);
			
			for( let trace of data[yi] ) {
				
				for( let x = trace.xa; x < trace.xb; x++ )
					handler( x, y );
				
			}
		}
		
	}
	
	/* */
	
	getBorderData() {
		
		/// if already processed
		if( this.boderData )
			return this.boderData;
		
		///
		let data = this.data;
		let points = new Array();
		
		for( let iy in data ) {
			
			let y = parseInt(iy);
			
			let top = data[ y-1 ];
			let bottom = data[ y+1 ];
			
			for( let trace of data[iy] ) {
				
				if( !top ) {
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						points.push(new Point( x, y ));
					
				} else if( !bottom ) {
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						points.push(new Point( x, y ));
					
				} else {
					
					points.push(new Point( trace.xa, y ));
					points.push(new Point( trace.xb, y ));
					
					for( let x = trace.xa+1, xo = trace.xb-1; x <= xo; x++ ) {
						
						let connect_up = false;
						let connect_down = false;
						
						for( let t of top ) {
							if( x >= t.xa && x <= t.xb ) {
								connect_up = true;
								break;
							}
						}
						
						for( let t of bottom ) {
							if( x >= t.xa && x <= t.xb ) {
								connect_down = true;
								break;
							}
						}
						
						if( !(connect_up && connect_down) )
							points.push(new Point( x, y ));
						
					}
					
				}
				
			}
		
		}
		
		///
		///
		let dx = 0;
		let dy = 0;
		
		for( let p of points ) {
			dx += p.x;
			dy += p.y;
		}
		
		
		let center = new Point( 0, 0 );
		
		if( points.length > 0 ) {
			center.x = Math.floor( dx/points.length );
			center.y = Math.floor( dy/points.length );
		}
		
		let distAverage = 0;
		
		for( let p of points ) {
			
			p.dist = p.distance( center );
			distAverage += p.dist;
			
		}
		
		if( points.length > 0 )
			distAverage = distAverage/points.length;
		
		let near = points[0];
		let far = points[0];
		
		/// Standard deviation of distances
		let distDeviation = 0;
		
		for( let p of points ) {
			
			if( p.dist < near.dist ) near = p;
			if( p.dist > far.dist ) far = p;
			
			distDeviation += Math.pow( p.dist - distAverage, 2 );
			
		}
		
		if( points.length > 1 )
			distDeviation = distDeviation/(points.length-1);
		
		distDeviation = Math.sqrt( distDeviation );
		
		///
		///
		points = connectPoints( points );
		
		return this.boderData = { points, center, near, far, distAverage, distDeviation };
		
	}
	
}

