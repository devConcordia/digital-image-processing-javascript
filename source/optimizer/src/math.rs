
/* Math methods
 *	
 */

//pub fn clamp_i16(a: i16, b: i16, c: i16) -> i16 { a.max(b).min(c) }
pub fn clamp_i32(a: i32, b: i32, c: i32) -> i32 { a.max(b).min(c) }
pub fn clamp_f32(a: f32, b: f32, c: f32) -> f32 { a.max(b).min(c) }
//pub fn clamp_f64(a: f64, b: f64, c: f64) -> f64 { a.max(b).min(c) }

pub fn hypot_f32(a: f32, b: f32) -> f32 { (a.powi(2) + b.powi(2)).sqrt() }
//pub fn hypot_f64(a: f64, b: f64) -> f64 { (a.powi(2) + b.powi(2)).sqrt() }
