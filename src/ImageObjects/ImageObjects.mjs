
import ImageObject from './ImageObject.mjs'

import { lines_scan, lines_connect } from './core.mjs'

/** distance
 *	
 *	@param {}
 */
function distance( a, b ) {
	
	let aw2 = a.width/2,
		bw2 = b.width/2,
		ah2 = a.height/2,
		bh2 = b.height/2;
	
	return Math.hypot( (a.x + aw2) - (b.x + bw2), (a.y + ah2) - (b.y + bh2) );

}

/** ImageObjects
 *	
 *	
 *	
 */
export default class ImageObjects {
	
	constructor( imagedata ) {
		
		var lines = lines_connect( lines_scan( imagedata ) );
		
		for( var line of lines ) {
			for( var trace of line ) {
				
				var id = trace.id;
				
				if( !(id in this) ) this[ id ] = new ImageObject( id );
				
				this[ id ].append( trace );
				
			}
		}
		
	}
	
	get length() {
		
		return Object.keys( this ).length;
		
	}
	
	remove( method ) {
		
		for( var id in this ) 
			if( method( this[ id ] ) ) 
				delete this[ id ];
		
	}
	
	close() {
		
		for( var id in this ) 
			this[ id ].close();
		
	}
	
	/** 
	 *	
	 *	ajunta objetos dentro de outros
	 *	
	 */
	merge( delta ) {
		
		var objects = this;
		
		var keys = Object.keys( this );
			keys.sort(function(a, b){ return objects[b].pixels - objects[a].pixels });
		
		for( var i = 0; i < keys.length; i++ ) {
			
			var target = this[ keys[i] ];
			
			for( var j = i+1; j < keys.length; j++ ) {
				
				var object = this[ keys[j] ];
				
				if( object.insideOf( target ) ) {
					if( distance( target, object ) <= delta ) {
						
						for( var y in object.traces ) 
							target.append( ...object.traces[y] );
						
						delete this[ keys[j] ];
						
						keys.splice( j--, 1 );
						
					}
				}
				
			}
		}
		
	}
	
	/** 
	 *	
	 *	ajunta objetos proximo de outros
	 *	
	 */
/*	join( delta ) {
		
		let notremove = [];
		var objects = [];
		
		for( let a in this ) {
			
			var target = this[ a ];
			
			for( let b in this ) {
				
				if( a == b ) continue;
				
				let object = this[ b ];
				
				if( distance( target, object ) <= delta ) {
					
					for( var y in object.traces ) 
						target.append( ...object.traces[y] );
					
					if(!notremove.includes(a))
						notremove.push( a );
					
					if(!objects.includes(b) && !notremove.includes(b))
						objects.push( b );
					
				//	delete this[ b ];
					
				}
			
			}
		}
		
		for( let k of objects ) delete this[k];
		
	}
	
*/	
	
	
	fill({ width, height, data }, r, g, b ) {
		
		for( var id in this ) {
			
			var { traces } = this[ id ];
			
			for( var y in traces ) {
				for( var trace of traces[y] ) {
					
					var offset = trace.y * width;
					
					for( var x = trace.x1; x < trace.x2; x++ ) {
						
						var i = (offset + x) * 4;
						
						data[ i   ] = r;
						data[ i+1 ] = g;
						data[ i+2 ] = b;
						data[ i+3 ] = 255;
						
					}
					
				}
			}
			
		}
		
	}
	
	debug({ width, height, data }) {
		
		for( var id in this ) {
			
			var { traces } = this[ id ];
			
			var r = Math.floor( Math.random() * 220 + 35 ),
				g = Math.floor( Math.random() * 220 + 35 ),
				b = Math.floor( Math.random() * 220 + 35 );
			
			for( var y in traces ) {
				for( var trace of traces[y] ) {
					
					var offset = trace.y * width;
					
					for( var x = trace.x1; x < trace.x2; x++ ) {
						
						var i = (offset + x) * 4;
						
						data[ i   ] = r;
						data[ i+1 ] = g;
						data[ i+2 ] = b;
						data[ i+3 ] = 255;
						
					}
					
				}
			}
			
		}
		
	}
	
	[Symbol.iterator]() {
		
		var objects = this;
	
		var keys = Object.keys( objects );
		var i = 0;
		
		return {
			next() {
				if( i < keys.length ) 
					return { value: objects[ keys[ i++ ] ], done: false };
			
				return { done: true };
			}
		}
		
	}
	
}
