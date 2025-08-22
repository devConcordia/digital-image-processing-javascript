
import { createInputFile } from './common.mjs'

import DIP from '../DIP.mjs'
import Step from './Step.mjs'

/** InputStep
 *	
 */
export class InputStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		
		let image = new Image();
			image.onload = function() { self.input( image ) };
		
		///
		let { div, input } = createInputFile();
		this.controls.appendChild( div );
		
		input.addEventListener('change', function( evt ) {
				
			const file = evt.target.files[0];
			
			if( file )
				image.src = URL.createObjectURL( file );
			
		});
		
		this.disableRemoveButton();
		
	}
	
}
