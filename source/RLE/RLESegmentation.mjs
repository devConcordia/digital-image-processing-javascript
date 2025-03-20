
///
import { 
	getLinesFromGrayImageData, 
	connectTraces, 
	distance 
} from './core.mjs';

///
import RLEObject from './RLEObject.mjs';

/** RLESegmentation
 *	
 */
export default class RLESegmentation {
	
	/** 
	 *	
	 *	@param  {GrayImageData} input
	 *	@return  {RLESegmentation}
	 */
	constructor( input ) {
		
		/// {Array[][]} lines		[[ {RLETrace}, ... ], ...]
		let lines = getLinesFromGrayImageData( input );
		
		///
		connectTraces( lines );
		
		///
		for( let line of lines ) {
			for( let trace of line ) {
				
				let id = trace.id;
				
				if( !(id in this) ) 
					this[ id ] = new RLEObject( id );
				
				this[ id ].append( trace );
				
			}
		}
		
	}
	
	get length() { return Object.keys( this ).length }
	
	/** 
	 *	
	 */
	close() {
		
		for( let id in this ) 
			this[ id ].close();
		
	}
	
	/** filter
	 *	
	 *	@param {Function} statement
	 */
	filter( statement ) {
		
		for( let id in this ) 
			if( statement( this[ id ] ) ) 
				delete this[ id ];
		
	}
	
	merge( delta ) {
		
		let objects = this;
		
		let keys = Object.keys( this );
			keys.sort(function(a, b){ return objects[b].pixels - objects[a].pixels });
		
		for( let i = 0; i < keys.length; i++ ) {
			
			let target = this[ keys[i] ];
			
			for( let j = i+1; j < keys.length; j++ ) {
				
				let object = this[ keys[j] ];
				
				if( object.insideOf( target ) ) {
					if( distance( target, object ) <= delta ) {
						
						for( let y in object.data ) 
							target.append( ...object.data[y] );
						
						delete this[ keys[j] ];
						
						keys.splice( j--, 1 );
						
					}
				}
				
			}
		}
		
	}
	
	/** debug
	 *	
	 *	@param {ImageData} imagedata
	 */
	debug( imagedata ) {
		
		let width = imagedata.width;
		let buffer = new Uint32Array( imagedata.data.buffer );
		
		for( let id in this ) {
			
			/// RLEObject
			let object = this[ id ];
			
			let data = object.data;
			let color = object.color.getBytes();
			
			for( let y in data ) {
				for( let trace of data[ y ] ) {
					
					let offset = trace.y * width;
					
					for( let x = trace.xa; x <= trace.xb; x++ )
						buffer[ offset + x ] = color;
					
				}
			}
			
		}
		
	}
	
	[Symbol.iterator]() {
		
		let objects = this;
	
		let keys = Object.keys( objects );
		let i = 0;
		
		return {
			next() {
				
				if( i < keys.length ) 
					return { value: objects[ keys[ i++ ] ], done: false };
			
				return { done: true };
				
			}
		}
		
	}
	
}
