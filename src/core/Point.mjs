/** Point
 *	
 */
export default class Point extends Int16Array {
	
	constructor( x = 0, y = 0 ) {
		
		super([ x, y ]);
		
	}
	
	get x() { return this[0] }
	get y() { return this[1] }
	
	set x( v ) { this[0] = v }
	set y( v ) { this[1] = v }
	
	equals( p ) {
		
		return this.x == p.x && this.y == p.y
		
	}
	
	distance( p ) {
		
		return Math.hypot( this.x - p.x, this.y - p.y );
		
	}
	
	toJSON() {
		
		return [ this[0], this[1] ];
		
	}
	
}
