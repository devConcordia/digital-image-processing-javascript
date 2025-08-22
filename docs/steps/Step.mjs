
import DIP from '../DIP.mjs'
import { createIconButton, createSwitchCheckbox } from './common.mjs';

/** Step
 *	
 */
export default class Step {
	
	constructor() {
		
		const self = this;
		
		let node = document.createElement('div');
			node.className = 'section-box';
		
		let head = document.createElement('div');
			head.className = 'd-flex justify-content-between align-items-center mb-2';
		
		let spanTitle = document.createElement('span');
			spanTitle.innerHTML = this.constructor.name;
			
		let btnRemove = document.createElement('button');
			btnRemove.type = 'button';
			btnRemove.className = 'btn btn-close';
			btnRemove.setAttribute('aria-label', 'Remove');
			btnRemove.addEventListener('click', function() {
				
				let { back, next } = self;
				
				if( back ) 
					back.next = next;
				
				
				if( next ) {
					next.back = back;
					next.compute();
				}
				
				node.remove();
				
			});
			
		///
	//	let hf = createSwitchCheckbox( this.constructor.name, true );
	//	hf.input.onchange = function() { self.compute() };
	//	
	//	head.appendChild( hf.div );
		head.appendChild( spanTitle );
		head.appendChild( btnRemove );
		node.appendChild( head );
		
				
			
		
		///
		let content = document.createElement('div');
		//	content.className = 'd-flex justify-content-evenly align-items-stretch p-1';
			content.className = 'd-flex flex-md-row flex-column justify-content-between align-items-stretch p-1';
		
		let divPreview = document.createElement('div');
			divPreview.className = 'p-1';
			
		let divControls = document.createElement('div');
			divControls.className = 'p-1';
			
		content.appendChild( divControls );
		content.appendChild( divPreview );
		node.appendChild( content );
		
		///
		let divLog = document.createElement('pre');
			divLog.className = 'p-1';
		
		node.appendChild( divLog );
		
		///
		let divDownloads = document.createElement('div');
			divDownloads.className = 'p-3';
		
		///
		let btnPng = createIconButton('download', 'PNG');
		let btnJpeg = createIconButton('download', 'JPEG');
		let btnWebp = createIconButton('download', 'WEBP');
		
		divDownloads.appendChild( btnPng.button );
		divDownloads.appendChild( btnJpeg.button );
		divDownloads.appendChild( btnWebp.button );
		node.appendChild( divDownloads );
		
		///
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		
		divPreview.appendChild( canvas );
		
		///
		this.node = node;
		this.head = head;
	//	this.inEnable = hf.input;
		this.preview = divPreview;
		this.controls = divControls;
		this.log = divLog;
		
		///
		this.canvas = canvas;
		this.context = context;
		this.source = null;
		
		this.back = null;
		this.next = null;
		
	}
	
	//get enable() {
	//	
	//	return this.inEnable.checked
	//	
	//}
	
	disableRemoveButton() {
		
		this.head.querySelector('button').style.display = 'none';
		
	}
	
	getFirstStep() {
		
		if( this.back )
			return this.back.getFirstStep();
		
		return this;
		
	}
	
	getLastStep() {
		
		if( this.next )
			return this.next.getLastStep();
		
		return this;
		
	}
	
	append( step ) {
		
		this.next = step;
		step.back = this;
		
	}
	
	render() {
		
		let { canvas, context, source } = this;
		
		/// case source is GrayImageData or BinaryImageData
		if( 'getImageData' in source )
			source = source.getImageData();
		
		///
		canvas.width = source.width;
		canvas.height = source.height;
		
		///
		if( source instanceof Image || source instanceof HTMLCanvasElement) {
			
			context.drawImage( source, 0, 0, source.width, source.height );
		
		} else if( source instanceof ImageData ) {
			
			context.putImageData( source, 0, 0 );
		
		}
		
	}
	
	/** 
	 * 	
	 *	@param {Image | Canvas} image
	 */
	input( image ) {
		
		let { canvas, context } = this;
		
		///
		canvas.width = image.width;
		canvas.height = image.height;
		
		context.drawImage( image, 0, 0, image.width, image.height );
		
		///
		this.source = context.getImageData(0, 0, canvas.width, canvas.height);
		
		/// extends to ColorImageData
		DIP.ColorImageData.Extends( this.source );
		
		///
		if( this.next )
			this.next.compute( this.source );
		
	}
	
	compute( input ) {
		
		let time = Date.now();
		
		if( !input ) input = this.back?.source;
		
		if( input ) {
		//	if( this.enable ) {
				
				if( typeof this.onCompute == 'function' )
					this.source = this.onCompute( input );
				
				this.render();
				
				if( this.next )
					this.next.compute( this.source );
				
		//	} else {
		//		
		//		if( this.next )
		//			this.next.compute( input );
		//		
		//	}
		
			this.log.innerHTML = input.width +'x'+ input.height +': took '+ (Date.now() - time) +' ms';
		
		} else {
			
			this.log.innerHTML = 'has not input ...';
			
		}
		
		
		
	}
	
	download( type ) {
		
		let a = document.createElement('a');
			a.download = Date.now().toString(36).toUpperCase() +'.'+ ((type == 'jpeg')? 'jpg' : type);
			a.href = this.canvas.toDataURL( 'image/'+ type );

		document.body.appendChild( a );

		a.click();
		a.remove();

	}
	
}
