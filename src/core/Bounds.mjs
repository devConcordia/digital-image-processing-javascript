
/** 
 *	
 */
function in_range( x, x1, x2 ) { return x >= x1 && x <= x2 }

/** Bounds
 *	
 */
export default class Bounds {
	
	constructor( left = 0, top = 0, right = 0, bottom = 0 ) {
		
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		
	}
	
	get x() { return this.left }
	get y() { return this.top }
	
	get width() { return this.right - this.left }
	get height() { return this.bottom - this.top }
	
	insideOf( rect ) {
		
		return 	in_range( this.left,   rect.left, rect.right ) &&
				in_range( this.right,  rect.left, rect.right ) &&
				in_range( this.top,    rect.top,  rect.bottom ) &&
				in_range( this.bottom, rect.top,  rect.bottom )
	
		
	}
	
}
