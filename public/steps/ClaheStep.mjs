
import Step from './Step.mjs'

/** ClaheStep
 *	
 */
export class ClaheStep extends Step {
	
	onCompute( input ) {
		
		return input.clone().clahe();
		
	}
	
}
