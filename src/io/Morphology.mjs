
//import Skeleton from "./Skeleton.mjs"

/** Morphology
 *
 */
export default class Morphology {
	
//	static Skeleton = Skeleton;
	
	
	/** dilate
	 *	
	 *	@param {Number} size
	 *	@param {ImageData} { data, width, height }
	 *	@param {ImageData} output
	 *	@return {ImageData}
	 */
	static dilate( size, { data, width, height }, output ) {
		
		if( !output ) output = new ImageData( width, height );
			
		var doutput = output.data;
		
		var half = Math.floor( size / 2 );
		
		for( var y = 0; y < height; y++ ) {
			
			var offset_row = y * width;
			
			for( var x = 0; x < width; x++ ) {

				var result = 0;

				for( var i = -half; i < half; i++ ) {
					for( var j = -half; j < half; j++ ) {
						
						var n = 4 * ( width*( y + i ) + x + j );

						var d = data[n];
						
						if( d > result ) result = d;
						
					}
				}
				
				var index = (offset_row + x) * 4;
				
				doutput[ index   ] = result;
				doutput[ index+1 ] = result;
				doutput[ index+2 ] = result;
				doutput[ index+3 ] = 255;
				
			}

		}

		return output;

	}

	/** erode
	 *	
	 *	@param {Number} size
	 *	@param {ImageData} { data, width, height }
	 *	@param {ImageData} output
	 *	@return {ImageData}
	 */
	static erode( size, { data, width, height }, output ) {
		
		if( !output ) output = new ImageData( width, height );
			
		var doutput = output.data;
		
		var half = Math.floor( size / 2 );
		
		for( var y = 0; y < height; y++ ) {
			
			var offset_row = y * width;
			
			for( var x = 0; x < width; x++ ) {

				var result = 255;

				for( var i = -half; i < half; i++ ) {
					for( var j = -half; j < half; j++ ) {
						
						var n = 4 * ( width*( y + i ) + x + j );

						var d = data[n];
						
						if( d < result ) result = d;
						
					}
				}
				
				var index = (offset_row + x) * 4;
				
				doutput[ index   ] = result;
				doutput[ index+1 ] = result;
				doutput[ index+2 ] = result;
				doutput[ index+3 ] = 255;
				
			}

		}
		
		return output;

	}
	
	/** open
	 *	
	 *	@param {Number} size
	 *	@param {ImageData} iamgedata
	 *	@return {ImageData}
	 */
	static open( size, imagedata ) {
		
		var temporary = new ImageData( imagedata.width, imagedata.height );
		
		Morphology.erode( size, imagedata, temporary );
		Morphology.dilate( size, temporary, imagedata );
		
		return imagedata;
		
	}
	
	/** close
	 *	
	 *	@param {Number} size
	 *	@param {ImageData} iamgedata
	 *	@return {ImageData}
	 */
	static close( size, imagedata ) {
		
		var temporary = new ImageData( imagedata.width, imagedata.height );
		
		Morphology.dilate( size, imagedata, temporary );
		Morphology.erode( size, temporary, imagedata );
		
		return imagedata;
		
	}
	
}
