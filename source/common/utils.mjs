
/** clamp
 *	
 *	@param {Number} a
 *	@param {Number} b = 0
 *	@param {Number} c = 255
 *	@return {Number}			integer
 */
export function clamp( a, b = 0, c = 255 ) {
	
	return Math.min( Math.max( Math.floor(a), b ), c )

}

/** 
 *	
 */
export function inRange( x, xa, xb ) { return x >= xa && x <= xb }

/** 
 *	
 */
export function outRange( x, xa, xb ) { return x < xa || x > xb }


/**	calcCdf (Cumulative Distribution Function)
 *	
 */
export function calcCdf( histogram ) {
	
    // Extrair as chaves (bins) e valores (frequências) do histograma
    const keys = Object.keys(histogram);
    const values = Object.values(histogram);
    
    // Calcular a soma total dos valores do histograma
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    // Calcular o CDF diretamente e armazenar em um novo objeto
    const output = new Object;
    let cumulative = 0;
    
    for( let i = 0; i < values.length; i++ ) {
		
        // Atualiza o acumulado
		cumulative += values[i] / sum;
		
		// Calcula a equalização
        output[ keys[i] ] = Math.floor(256 * cumulative);
		
    }
    
    return output;
	
}
