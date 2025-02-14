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
		
		return this[0] == p[0] && this[1] == p[1]
		
	}
	
	distance( p ) {
		
		return Math.hypot( this[0] - p[0], this[1] - p[1] )
		
	}
	
	toJSON() {
		
		return Array.from( this )
		
	}
	
}
