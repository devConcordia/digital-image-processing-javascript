use wasm_bindgen::prelude::*;

mod math;
mod rgba;
mod gray;

// 
// rgba
// 

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

// 
// gray
// 

#[wasm_bindgen]
pub fn gray_conv(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	gray::conv(image, image_w, image_h, matrix, matrix_w, matrix_h)
}

#[wasm_bindgen]
pub fn gray_dilate(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	gray::dilate(image, image_w, image_h, matrix, matrix_w, matrix_h)
}

#[wasm_bindgen]
pub fn gray_erode(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	gray::erode(image, image_w, image_h, matrix, matrix_w, matrix_h)
}

#[wasm_bindgen]
pub fn gray_open(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	gray::open(image, image_w, image_h, matrix, matrix_w, matrix_h)
}

#[wasm_bindgen]
pub fn gray_close(image: &[u8], image_w: i32, image_h: i32, matrix: &[f32], matrix_w: i32, matrix_h: i32) -> Vec<u8> {
	gray::close(image, image_w, image_h, matrix, matrix_w, matrix_h)
}
