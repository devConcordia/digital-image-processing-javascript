
import { createRangeInput } from './common.mjs'

import Step from './Step.mjs'

/** ThresholdStep
 *	
 */
export class ThresholdStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
		let dfactor = createRangeInput( 'Threshold', 0, 255, 128, 1, onChange );
		
		///
		this.factor = dfactor.input;
		
		///
		this.controls.appendChild( dfactor.div );
		
	}
	
	onCompute( input ) {
		
		///
		return input.clone().threshold( parseInt(this.factor.value) );
		
	}
	
}
