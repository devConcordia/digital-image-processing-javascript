
import GrayImageData from '../GrayImageData.mjs';

///
import { 
	getLinesFromImageData, 
	getLinesFromGrayImageData, 
	connectTraces, 
	distance 
} from './core.mjs';

///
import RLEObject from './RLEObject.mjs';

/** RLESegmentation
 *	
 *	
 */
export default class RLESegmentation {
	
	/** Create
	 *	
	 *	@param  {ImageData | GrayImageData} input
	 *	@return  {RLESegmentation}
	 */
	static Create( input ) {
		
		/// {Array[][]} lines		[[ {RLETrace}, ... ], ...]
		let lines;
		
		if( input instanceof ImageData ) {
			
			lines = getLinesFromImageData( input );
			
		} else if( input instanceof GrayImageData ) {
			
			lines = getLinesFromGrayImageData( input );
			
		}
		
		///
		connectTraces( lines );
		
		///
		let output = new RLESegmentation();
		
		///
		for( let line of lines ) {
			for( let trace of line ) {
				
				let id = trace.id;
				
				if( !(id in output) ) 
					output[ id ] = new RLEObject( id );
				
				output[ id ].append( trace );
				
			}
		}
		
		return output;
		
	}
	
	/* ... */
	
	clear() {
		
		for( let id in this )
			delete this[ id ];
		
	}
	
	remove( method ) {
		
		for( let id in this ) 
			if( method( this[ id ] ) ) 
				delete this[ id ];
		
	}
	
	close() {
		
		for( let id in this ) 
			this[ id ].close();
		
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
	
	fill( imagedata ) {
		
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
	
	/* ... */
	
	get length() { return Object.keys( this ).length }
	
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
