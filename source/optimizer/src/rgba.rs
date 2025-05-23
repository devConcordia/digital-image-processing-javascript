
/* RGBA methods
 *	
 */

use crate::math;

pub use math::clamp_i32;
pub use math::clamp_f32;
pub use math::hypot_f32;



pub fn gray_scale(data: &[u8]) -> Vec<u8> {
    
	let length: usize = data.len();
	let size: usize = length / 4;
	
	// init with 255 values
	let mut output: Vec<u8> = vec![255; length];
	
	for i in 0..size {
		
		let k = i * 4;
		
		let r = data[k  ] as f32;
		let g = data[k+1] as f32;
		let b = data[k+2] as f32;
		
		let v: u8 = (r * 0.2989 + g * 0.5870 + b * 0.1140).floor()  as u8;
		
		output[k  ] = v;
		output[k+1] = v;
		output[k+2] = v;
		
	}
	
	output
	
}

pub fn conv(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	// init with 255 values, default to alpha (RGBA)
	let mut output: Vec<u8> = vec![255; image.len()];
	
	let mwh: i32 = matrix_w/2;
	let mhh: i32 = matrix_h/2;
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		for x in 0..image_w {
			
			let mut rx: f32 = 0.0;
			let mut ry: f32 = 0.0;
			let mut gx: f32 = 0.0;
			let mut gy: f32 = 0.0;
			let mut bx: f32 = 0.0;
			let mut by: f32 = 0.0;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					let mx: f32 = matrix[ (j*matrix_w + i) as usize ];
					let my: f32 = matrix[ (i*matrix_w + j) as usize ];
					
					let xj = clamp_i32( x + (j - mwh), 0, w );
					let yi = clamp_i32( y + (i - mhh), 0, h );
					
					let n = 4 * (yi * image_w + xj) as usize;
					
					let r = image[ n   ] as f32;
					let g = image[ n+1 ] as f32;
					let b = image[ n+2 ] as f32;
					
					rx += r * mx;
					ry += r * my;
					
					gx += g * mx;
					gy += g * my;
					
					bx += b * mx;
					by += b * my;
					
				}
			}
			
			let offset = 4 * (y * image_w + x) as usize;
			
			let r: f32 = clamp_f32( hypot_f32( rx, ry ), 0.0, 255.0 );
			let g: f32 = clamp_f32( hypot_f32( gx, gy ), 0.0, 255.0 );
			let b: f32 = clamp_f32( hypot_f32( bx, by ), 0.0, 255.0 );
			
			output[ offset   ] = r as u8;
			output[ offset+1 ] = g as u8;
			output[ offset+2 ] = b as u8;
			
		}
	}
	
	output
	
}

pub fn dilate(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	// init with 255 values, default to alpha (RGBA)
	let mut output: Vec<u8> = vec![255; image.len()];
	
	let mwh: i32 = matrix_w/2; // matrix width half
	let mhh: i32 = matrix_h/2;	// matrix height half
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		
		let offset_row = y * image_w;
		
		for x in 0..image_w {
			
			let mut vr: u8 = 0;
			let mut vg: u8 = 0;
			let mut vb: u8 = 0;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					// ignore if value equals zero
					if matrix[ (i*matrix_w + j) as usize ] == 1.0 {
						
						let xj = clamp_i32( x + (j - mwh), 0, w );
						let yi = clamp_i32( y + (i - mhh), 0, h );
						
					//	let n = (4 * ( image_w*( y + i ) + x + j )) as usize;
						let n = 4 * ( image_w*yi + xj ) as usize;
						
						if image[n  ] > vr { vr = image[n  ] }
						if image[n+1] > vg { vg = image[n+1] }
						if image[n+2] > vb { vb = image[n+2] }
					
					}
					
				}
			}
			
			let index = 4 * (offset_row + x) as usize;
			
			output[ index   ] = vr;
			output[ index+1 ] = vg;
			output[ index+2 ] = vb;
				
		}
	}
	
	output
	
}



pub fn erode(image: &[u8], image_w: i32, image_h: i32, 
			matrix: &[f32], matrix_w: i32, matrix_h: i32 ) -> Vec<u8> {
	
	// init with 255 values, default to alpha (RGBA)
	let mut output: Vec<u8> = vec![255; image.len()];
	
	let mwh: i32 = matrix_w/2; // matrix width half
	let mhh: i32 = matrix_h/2;	// matrix height half
	
	let w: i32 = image_w - 1;
	let h: i32 = image_h - 1;
	
	for y in 0..image_h {
		
		let offset_row = y * image_w;
		
		for x in 0..image_w {
			
			let mut vr: u8 = 255;
			let mut vg: u8 = 255;
			let mut vb: u8 = 255;
			
			for i in 0..matrix_h {
				for j in 0..matrix_w {
					
					// ignore if value equals zero
					if matrix[ (i*matrix_w + j) as usize ] == 1.0 {
					
						let xj = clamp_i32( x + (j - mwh), 0, w );
						let yi = clamp_i32( y + (i - mhh), 0, h );
						
					//	let n = (4 * ( image_w*( y + i ) + x + j )) as usize;
						let n = 4 * ( image_w*yi + xj ) as usize;
						
						if image[n  ] < vr  { vr = image[n  ]; }
						if image[n+1] < vg  { vg = image[n+1]; }
						if image[n+2] < vb  { vb = image[n+2]; }
					
					}
					
				}
			}
			
			let index = 4 * (offset_row + x) as usize;
			
			output[ index   ] = vr;
			output[ index+1 ] = vg;
			output[ index+2 ] = vb;
				
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

