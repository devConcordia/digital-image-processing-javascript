
import IntegralImage from './core/IntegralImage.mjs';

/** 
 *	
 */
export default class Thresholding {
	
	static Global({ data }, thresholds, min = 0, max = 255 ) {
		
		for( let i = 0; i < data.length; i += 4 ) {

			/// gray scale
			let pixel = data[ i ] > thresholds? max : min;
			
			data[ i   ] = pixel;
			data[ i+1 ] = pixel;
			data[ i+2 ] = pixel;

		}

	}
	
	static Mean({ data }, min = 0, max = 255, optimizer = 5 ) {
		
		let length = data.length;
		let size = length/4;
		let mean = 0;
		
		let stepOptimizer = 4*optimizer;
		
		for( let i = 0; i < length; i += stepOptimizer )
			mean += data[ i ];
		
		console.log( mean )
		
		mean = mean/(size/optimizer);
		
		console.log( mean )
		
		for( let i = 0; i < length; i += 4 ) {

			/// gray scale
			let pixel = data[ i ] > mean? 255 : 0;
			
			data[ i   ] = pixel;
			data[ i+1 ] = pixel;
			data[ i+2 ] = pixel;

		}
		
	}
	
	
	/** Adaptive
	 * 
	 * 	@ref https://stackoverflow.com/questions/31943467/javascript-bradley-adaptive-thresholding-implementation
	 * 	
	 * 	
	 * 	@ref https://github.com/opencv/opencv/blob/master/modules/imgproc/src/thresh.cpp
	 * 	
	 * 	
	 * 	void cv::adaptiveThreshold( InputArray _src, OutputArray _dst, double maxValue, int method, int type, int blockSize, double delta ) {
	 *		...
	 * 		if (method == ADAPTIVE_THRESH_GAUSSIAN_C) {
	 *			Mat srcfloat,meanfloat;
	 *			src.convertTo(srcfloat,CV_32F);
	 *			meanfloat=srcfloat;
	 *			GaussianBlur(srcfloat, meanfloat, Size(blockSize, blockSize), 0, 0, BORDER_REPLICATE|BORDER_ISOLATED);
	 *			meanfloat.convertTo(mean, src.type());
	 *		}
	 * 	 	...
	 * 	}
	 * 	
	 * 	
	 * 	
	 * 	
	 */
	static Adaptive( imagedata, size, ratio = 1, min = 0, max = 255 ) {
		
	//	min = 0xff000000 | (min<<16) | (min<<8) | min;
	//	max = 0xff000000 | (max<<16) | (max<<8) | max;
		
	//	var integral = buildIntegral_Gray(imagedata);

		var width = imagedata.width;
		var height = imagedata.height;
		
		// in fact it's s/2, but since we never use s...
	//	var size = width >> 4;
		
		if( !size ) size = width >> 4;
		
	//	console.log( size, width >> 4 )
		
		let integral = IntegralImage.FromImageData( imagedata );
		

		var sourceData = imagedata.data;
		
	//	var result = createImageData(width, height);
		var result = new ImageData(width, height);
		var resultData32 = new Uint32Array( result.data.buffer );

	//	var x = 0,
	//		y = 0;
		//	,
		//	lineIndex = 0;

		for( let y = 0; y < height; y++/*, lineIndex += width */) {
			
			let offset = y * width;
			
			for( let x = 0; x < width; x++ ) {
				
			//	let value = sourceData[ (lineIndex + x) << 2 ];
			//	let value = sourceData[ (offset + x) << 2 ];
				let value = sourceData[ 4*(offset + x) ];
				
				let x1 = Math.max(x - size, 0);
				let y1 = Math.max(y - size, 0);
				let x2 = Math.min(x + size, width - 1);
				let y2 = Math.min(y + size, height - 1);
				
				let area = (x2 - x1 + 1) * (y2 - y1 + 1);
				
			//	var localIntegral = getIntegralAt( integral, width, x1, y1, x2, y2 );

			//	var localIntegral = integral.getArea( x1, y1, x2 - x1, y2 - y1 );
				
				var localIntegral = integral.fromPoints( x1, y1, x2, y2 );
			//	let localIntegral = integral.getArea( x1, y1, s, s );
				
				if( value * area > localIntegral * ratio ) {
					
					resultData32[ offset + x ] = 0xFFFFFFFF;
				//	resultData32[ lineIndex + x ] = max;
					
				} else {
					
					resultData32[ offset + x ] = 0xFF000000;
				//	resultData32[ lineIndex + x ] = min;
					
				}
				
			}
		}
		
		return result;
	//	return integral;
	
	}
	
}


