
import { createRangeInput } from './common.mjs'

import Step from './Step.mjs'

/** BrightnessStep
 *	
 */
export class BrightnessStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
		let dfactor = createRangeInput( 'Brightness', 0, 1, 1, .1, onChange );
		
		///
		this.factor = dfactor.input;
		
		this.controls.appendChild( dfactor.div );
		
	//	let dr = createRangeInput( 'Brightness', 0, 1, 1, .1, onChange );
	//	let dg = createRangeInput( 'G', 0, 1, 1, .1, onChange );
	//	let db = createRangeInput( 'B', 0, 1, 1, .1, onChange );
		
		///
	//	this.r = dr.input;
	//	this.g = dg.input;
	//	this.b = db.input;
		
		///
	//	this.controls.appendChild( dr.div );
	//	this.controls.appendChild( dg.div );
	//	this.controls.appendChild( db.div );
		
	}
	
	onCompute( input ) {
		
		///
		return input.clone().brightness( parseFloat(this.factor.value) );
		
		///
	//	return input.brightness( 
	//		parseFloat(this.r.value),
	//		parseFloat(this.g.value),
	//		parseFloat(this.b.value)
	//	);
		
	}
	
}
