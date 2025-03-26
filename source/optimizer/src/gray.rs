
/* Gray methods
 *	
 */

use crate::math;

pub use math::clamp_i32;
pub use math::clamp_f32;
pub use math::hypot_f32;


pub fn conv(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	//
	let mut output: Vec<u8> = vec![0; image.len()];
	
	let mwh: i32 = matrix_w/2;
	let mhh: i32 = matrix_h/2;
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		for x in 0..image_w {
			
			let mut vx: f32 = 0.0;
			let mut vy: f32 = 0.0;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					let mx: f32 = matrix[ (j*matrix_w + i) as usize ];
					let my: f32 = matrix[ (i*matrix_w + j) as usize ];
					
					let xj = clamp_i32( x + (j - mwh), 0, w );
					let yi = clamp_i32( y + (i - mhh), 0, h );
					
					let n = (yi * image_w + xj) as usize;
					
					let v = image[ n ] as f32;
					
					vx += v * mx;
					vy += v * my;
					
				}
			}
			
			let offset = (y * image_w + x) as usize;
			
			output[ offset ] = clamp_f32( hypot_f32( vx, vy ), 0.0, 255.0 ) as u8;
			
		}
	}
	
	output
	
}

pub fn dilate(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	//
	let mut output: Vec<u8> = vec![0; image.len()];
	
	let mwh: i32 = matrix_w/2; // matrix width half
	let mhh: i32 = matrix_h/2; // matrix height half
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		
		let offset_row = y * image_w;
		
		for x in 0..image_w {
			
			let mut v: u8 = 0;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					// ignore if value equals zero
					if matrix[ (i*matrix_w + j) as usize ] == 1.0 {
						
						let xj = clamp_i32( x + (j - mwh), 0, w );
						let yi = clamp_i32( y + (i - mhh), 0, h );
						
						let n = ( image_w*yi + xj ) as usize;
						
						if image[n] > v { v = image[n] }
					
					}
					
				}
			}
			
			let index = (offset_row + x) as usize;
			
			output[ index ] = v;
				
		}
	}
	
	output
	
}



pub fn erode(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	// init with 255 values, default to alpha (RGBA)
	let mut output: Vec<u8> = vec![0; image.len()];
	
	let mwh: i32 = matrix_w/2; // matrix width half
	let mhh: i32 = matrix_h/2;	// matrix height half
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		
		let offset_row = y * image_w;
		
		for x in 0..image_w {
			
			let mut v: u8 = 255;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					// ignore if value equals zero
					if matrix[ (i*matrix_w + j) as usize ] == 1.0 {
					
						let xj = clamp_i32( x + (j - mwh), 0, w );
						let yi = clamp_i32( y + (i - mhh), 0, h );
						
						let n = ( image_w*yi + xj ) as usize;
						
						if image[n] < v { v = image[n]; }
					
					}
					
				}
			}
			
			let index = (offset_row + x) as usize;
			
			output[ index ] = v;
				
		}
	}
	
	output
	
}



pub fn open(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	let mut data: Vec<u8>;
	
	data = erode( image, image_w, image_h, matrix, matrix_w, matrix_h );
	data = dilate( &data, image_w, image_h, matrix, matrix_w, matrix_h );
	data
	
}


pub fn close(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	let mut data: Vec<u8>;
	
	data = dilate( image, image_w, image_h, matrix, matrix_w, matrix_h );
	data = erode( &data, image_w, image_h, matrix, matrix_w, matrix_h );
	data
	
}

