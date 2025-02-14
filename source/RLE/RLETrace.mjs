
import { inRange } from '../common/utils.mjs';

/** RLETrace
 *	
 */
export default class RLETrace {
	
	constructor( xa, xb, y, id = -1 ) {
		
		this.xa = xa;
		this.xb = xb;
		this.y = y;
		
		this.id = id;
		
	}
	
	get x() { return this.xa }
	get width() { return this.xb - this.xa }
	
	isConnect( t ) {
		
		return  (inRange(this.xa, t.xa, t.xb)) ||
				(inRange(this.xb, t.xa, t.xb)) ||
				(inRange(t.xa, this.xa, this.xb)) ||
				(inRange(t.xb, this.xa, this.xb))
	
	//	return  ((this.xa >= t.xa) && (this.xa <= t.xb)) ||
	//			((this.xb >= t.xa) && (this.xb <= t.xb)) ||
	//			((t.xa >= this.xa) && (t.xa <= this.xb)) ||
	//			((t.xb >= this.xa) && (t.xb <= this.xb))
	
	}
	
}
