
/** Device
 *	
 * 
 */
export default class Device {
	
	///
//	static BYTE_ORDER_BE = 'big-endian';
//	static BYTE_ORDER_ME = 'mixed-endian';
//	static BYTE_ORDER_LE = 'little-endian';
	
	static BIG_ENDIAN = 'big-endian';
	static MIXED_ENDIAN = 'mixed-endian';
	static LITTLE_ENDIAN = 'little-endian';
	
	/** GetEndianness | GetByteOrder
	 *	
	 *	@ref https://en.wikipedia.org/wiki/Endianness
	 *	
	 *	new Uint32Array([ 0xAABBCCDD ])
	 *	
	 *		BE: [ 0xAA, 0xBB, 0xCC, 0xDD ]
	 *		LE: [ 0xDD, 0xCC, 0xBB, 0xAA ]
	 *		ME: [ 0xBB, 0xAA, 0xDD, 0xCC ]
	 *	
	 */
	static GetEndianness() {
		
		let bytes = new Uint32Array([ 0xAABBCCDD ]);
		let data = new Uint8Array( bytes.buffer );
		
		if( data[0] === 0xAA && data[1] === 0xBB && data[2] === 0xCC && data[3] === 0xDD ) {
			
			return Device.BIG_ENDIAN;
			
		} else if( data[0] === 0xDD && data[1] === 0xCC && data[2] === 0xBB && data[3] === 0xAA ) {
			
			return Device.LITTLE_ENDIAN;
			
		} else if( data[0] === 0xBB && data[1] === 0xAA && data[2] === 0xDD && data[3] === 0xCC ) {
			
			return Device.MIXED_ENDIAN;
			
		}
		
		else null;
		
	}
	
}
