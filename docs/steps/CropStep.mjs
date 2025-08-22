
import { createInput, createRangeInput } from './common.mjs'

import DIP from '../DIP.mjs'
import Step from './Step.mjs'

/** CropStep
 *	
 */
export class CropStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
	//	let dx = createInput( 'x', 0, onChange );
	//	let dy = createInput( 'y', 0, onChange );
	//	let dw = createInput( 'width', 1000, onChange );
	//	let dh = createInput( 'height', 1000, onChange );
		
		let dx = createRangeInput( 'x', 0, 100, 0, 1, onChange );
		let dy = createRangeInput( 'y', 0, 100, 0, 1, onChange );
		let dw = createRangeInput( 'width', 1, 100, 100, 1, onChange );
		let dh = createRangeInput( 'height', 1, 100, 100, 1, onChange );
		
		///
		this.x = dx.input;
		this.y = dy.input;
		this.width = dw.input;
		this.height = dh.input;
		
		///
		let controls = this.controls;
		controls.appendChild( dx.div );
		controls.appendChild( dy.div );
		controls.appendChild( dw.div );
		controls.appendChild( dh.div );
		
	}
	
	onCompute( input ) {
		
		this.x.max = input.width - 1;
		this.y.max = input.height - 1;
		this.width.max = input.width;
		this.height.max = input.height;
		
		///
		let x = Math.max( 0, parseInt(this.x.value) );
		let y = Math.max( 0, parseInt(this.y.value) );
		let w = Math.min( input.width, parseInt(this.width.value) );
		let h = Math.min( input.height, parseInt(this.height.value) );
		
		///
		return input.crop( x, y, w, h );
		
	}
	
}
