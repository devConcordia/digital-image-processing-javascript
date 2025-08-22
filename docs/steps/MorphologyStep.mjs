
import { createSelect, createInput } from './common.mjs';
import Step from './Step.mjs'
import DIP from '../DIP.mjs'


class MorphologyStep extends Step {
	
	constructor() {
		
		super();
		
		const self = this;
		function onChange( evt ) { self.compute(); }
		
		let dsize = createInput( 'Size', 3, onChange );
		
		let dmatrix = createSelect( 'Kernel', [
			'Ones',
			'Zeros',
			'Radial'
		], onChange );
		
		///
		this.matrix = dmatrix.select;
		this.size = dsize.input;
		
		this.controls.appendChild( dmatrix.div );
		this.controls.appendChild( dsize.div );
		
	}
	
}

/** CloseMorphologyStep
 *	
 */
export class CloseStep extends MorphologyStep {
	
	onCompute( input ) {
		
		let size = parseInt( this.size.value );
		
		let matrix = DIP.Matrix[ this.matrix.value ]( size, size );
		
		return input.clone().close( matrix );
		
	}
	
}

/** OpenMorphologyStep
 *	
 */
export class OpenStep extends MorphologyStep {
	
	onCompute( input ) {
		
		let size = parseInt( this.size.value );
		
		let matrix = DIP.Matrix[ this.matrix.value ]( size, size );
		
		return input.clone().open( matrix );
		
	}
	
}

/** ErodeMorphologyStep
 *	
 */
export class ErodeStep extends MorphologyStep {
	
	onCompute( input ) {
		
		let size = parseInt( this.size.value );
		
		let matrix = DIP.Matrix[ this.matrix.value ]( size, size );
		
		return input.clone().erode( matrix );
		
	}
	
}

/** DilateMorphologyStep
 *	
 */
export class DilateStep extends MorphologyStep {
	
	onCompute( input ) {
		
		let size = parseInt( this.size.value );
		
		let matrix = DIP.Matrix[ this.matrix.value ]( size, size );
		
		return input.clone().dilate( matrix );
		
	}
	
}
