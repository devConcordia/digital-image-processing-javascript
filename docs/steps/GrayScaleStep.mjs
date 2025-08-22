
import DIP from '../DIP.mjs'
import Step from './Step.mjs'

/** GrayScaleStep
 *	
 */
export class GrayScaleStep extends Step {
	
	onCompute( input ) {
		
		return DIP.GrayImageData.From( input );
		
	}
	
}
