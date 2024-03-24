
/** clamp
 *	
 *	@param {Number} a
 *	@param {Number} b = 0
 *	@param {Number} c = 255
 *	@return {Number}			integer
 */
function clamp( a, b = 0, c = 255 ) {
	
	return Math.min( Math.max( Math.floor(a), b ), c )

};

/**	Calculates the normalized CDF (Cumulative Distribution Function)
 *	for the histogram.
 *
 *	Parameters:
 *		hist: frequencies of each pixel.
 *		bins: pixels.
 *
 *	Returns the CDF in a dictionary.
 */
function clahe_cdf( histogram ) {
	
	let hist = Object.values( histogram );
	let bins = Object.keys( histogram );
	
	
	let sum = 0;
	for( let x of hist ) sum += x;
	
	
	let pixel_probability = [];
	
	for( let i = 0; i < hist.length; i++ )
		pixel_probability[i] = hist[i] / sum;
	
	
	/// Calculating the CDF (Cumulative Distribution Function)
	///	cdf = np.cumsum(pixel_probability)
	let cdf = [ pixel_probability[0] ];
	
	for( let i = 1; i < pixel_probability.length; i++ )
		cdf[i] = pixel_probability[i] + cdf[i-1];
	
	
	let hist_eq = new Object;
	
	for( let i = 0; i < bins.length; i++ )
		hist_eq[ bins[i] ] = Math.floor( 256 * cdf[ i ] );
	
	return hist_eq;

}


export { clamp, clahe_cdf };
