
import { createSelect } from './common.mjs';
import Step from './Step.mjs'
import DIP from '../DIP.mjs'

/** ConvolutionStep
 *	
 */
export class ConvolutionStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
		let dmatrix = createSelect( 'Kernel', [
			'Sobel',
			'Laplace',
			'Prewitt',
			'Feldman',
			'Scharr',
			'Sharpen',
			'GaussianBlur',
			'Emboss'
		], onChange );
		
		///
		this.matrix = dmatrix.select;
		
		this.controls.appendChild( dmatrix.div );
		
	}
	
	onCompute( input ) {
		
		let matrix = DIP.Matrix[ this.matrix.value ]();
		
		return input.clone().conv( matrix );
		
	}
	
}
