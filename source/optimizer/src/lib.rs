use wasm_bindgen::prelude::*;

mod rgba;
mod math;

#[wasm_bindgen]
pub fn rgba_gray_scale(data: &[u8]) -> Vec<u8> {
	rgba::gray_scale(data)
}

#[wasm_bindgen]
pub fn rgba_conv(image: &[u8], image_w: i32, image_h: i32, 
				 matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
					 
	rgba::conv(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}
