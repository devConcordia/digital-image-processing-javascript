/** 
 *
 */
export default class Trace {
	
	constructor( x1, x2, y, id = -1 ) {
		
		this.x1 = x1;
		this.x2 = x2;
		
		this.y = y;
		
		this.id = id;
		
	}
	
	get x() { return this.x1 }
	get width() { return this.x2 - this.x1 }
	
	isConnect( t ) {
		
		return  ((this.x1 >= t.x1) && (this.x1 <= t.x2)) ||
				((this.x2 >= t.x1) && (this.x2 <= t.x2)) ||
				((t.x1 >= this.x1) && (t.x1 <= this.x2)) ||
				((t.x2 >= this.x1) && (t.x2 <= this.x2))
	
	}
	
}
