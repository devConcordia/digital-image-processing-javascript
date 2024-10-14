
import Bounds from '../core/Bounds.mjs'

/** ImageObjectData
 *	
 */
export default class ImageObjectData extends Bounds {

	constructor( id ) {
		
		super( Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, 0 );
		
		this.id = id;
		this.traces = new Map();
		
		this.pixels = 0;
		
	}
	
	/** append
	 *	
	 *	@param {Trace} arguments[]
	 */
	append() {
		
		for( var trace of arguments ) {
		
			this.left   = Math.min( this.left, trace.x1 );
			this.right  = Math.max( this.right, trace.x2/*+1*/ );
			this.top    = Math.min( this.top, trace.y );
			this.bottom = Math.max( this.bottom, trace.y/*+1*/ );
			
			this.pixels += trace.x2 - trace.x1;
			
			if( !(trace.y in this.traces) ) this.traces[ trace.y ] = new Array();
			
			this.traces[ trace.y ].push( trace );
			
		}
		
	}
	
	update() {
		
		var traces = this.traces;
		
		for( var y in traces ) {
			
			var line = traces[ y ].sort(function(a, b){ return a.x1 - b.x1 });
			
			for( var i = 0; i < line.length; i++ ) {
				
				var a = line[ i ],
					b = line[ i+1 ];
				
				if( !b ) break;
				
				if( a.x2 >= b.x1 ) {
					
					a.x2 = b.x2;
					
					line.splice( i+1, 1 );
					
					i--;
					
				}
				
			}
			
		}
		
		var pixels = 0;
		
		for( var y in traces )
			for( var t of traces[y] )
				pixels += t.x2 - t.x1;
		
		this.pixels = pixels;
		
	}
	
}
