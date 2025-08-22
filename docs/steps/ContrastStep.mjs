
import { createRangeInput } from './common.mjs'

import Step from './Step.mjs'

/** ContrastStep
 *	
 */
export class ContrastStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
		let dfactor = createRangeInput( 'Factor', 0, 256, 0, 1, onChange );
		
		///
		this.factor = dfactor.input;
		
		///
		this.controls.appendChild( dfactor.div );
		
	}
	
	onCompute( input ) {
		
		///
		return input.clone().contrast( parseInt(this.factor.value) );
		
	}
	
}

