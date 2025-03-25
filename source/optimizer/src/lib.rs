use wasm_bindgen::prelude::*;

mod rgba;
mod math;

#[wasm_bindgen]
pub fn rgba_gray_scale(data: &[u8]) -> Vec<u8> {
	rgba::gray_scale(data)
}

#[wasm_bindgen]
pub fn rgba_conv(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	
	rgba::conv(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}

#[wasm_bindgen]
pub fn rgba_dilate(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	
	rgba::dilate(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}

#[wasm_bindgen]
pub fn rgba_erode(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	
	rgba::erode(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}

#[wasm_bindgen]
pub fn rgba_open(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	
	rgba::open(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}

#[wasm_bindgen]
pub fn rgba_close(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	
	rgba::close(image, image_w, image_h, matrix, matrix_w, matrix_h)
	
}
