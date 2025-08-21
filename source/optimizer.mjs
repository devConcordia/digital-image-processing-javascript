
/// 
import initOptimizer, * as wasm from "./optimizer/pkg/optimizer.js";

///
export default {
	
	/** LoadWasm
	 *	
	 *	@param {String} path
	 *	@param {Function} onLoaded
	 */
	loadWasm: async function( path, onLoaded ) {
		
		//await initOptimizer( new URL( path, location.href ) );
		//await initOptimizer( fetch( new URL( path, location.href ) ) );
		await initOptimizer({ module_or_path: new URL( path, location.href ) });
		
		if( typeof onLoaded == 'function' ) onLoaded();
		
	},

	color: {
		
		/** 
		 *	
		 *	@param {ColorImageData} source
		 */
		grayScale( source ) {
			
			let gray = wasm.rgba_gray_scale( source.data );
			
			source.data.set( gray, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {ColorImageData} source
		 *	@param {Matrix} matrix
		 */
		conv( source, matrix ) {
			
			let data = wasm.rgba_conv( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {ColorImageData} source
		 *	@param {Matrix} matrix
		 */
		erode( source, matrix ) {
			
			let data = wasm.rgba_erode( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {ColorImageData} source
		 *	@param {Matrix} matrix
		 */
		dilate( source, matrix ) {
			
			let data = wasm.rgba_dilate( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {ColorImageData} source
		 *	@param {Matrix} matrix
		 */
		open( source, matrix ) {
			
			let data = wasm.rgba_open( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},

		/** 
		 *	
		 *	@param {ColorImageData} source
		 *	@param {Matrix} matrix
		 */
		close( source, matrix ) {
			
			let data = wasm.rgba_close( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		}
		
	},
	
	gray: {
		
		/** 
		 *	
		 *	@param {GrayImageData} source
		 *	@param {Matrix} matrix
		 */
		conv( source, matrix ) {
			
			let data = wasm.gray_conv( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {GrayImageData} source
		 *	@param {Matrix} matrix
		 */
		erode( source, matrix ) {
			
			let data = wasm.gray_erode( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {GrayImageData} source
		 *	@param {Matrix} matrix
		 */
		dilate( source, matrix ) {
			
			let data = wasm.gray_dilate( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},
		
		/** 
		 *	
		 *	@param {GrayImageData} source
		 *	@param {Matrix} matrix
		 */
		open( source, matrix ) {
			
			let data = wasm.gray_open( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		},

		/** 
		 *	
		 *	@param {GrayImageData} source
		 *	@param {Matrix} matrix
		 */
		close( source, matrix ) {
			
			let data = wasm.gray_close( 
				source.data,
				source.width,
				source.height,
				matrix,
				matrix.width,
				matrix.height
			);
			
			source.data.set( data, 0 );
			
		}

	}
	
}
