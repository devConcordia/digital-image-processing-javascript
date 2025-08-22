
import Step from './Step.mjs'

/** NegativeStep
 *	
 */
export class NegativeStep extends Step {
	
	onCompute( input ) {
		
		return input.clone().negative();
		
	}
	
}
