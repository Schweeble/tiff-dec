mod image;
mod utils;

use crate::image::{DataType, Image, Metadata};
use std::io::Cursor;
use tiff::decoder::Decoder;
use tiff::decoder::DecodingResult;

use utils::set_panic_hook;
use wasm_bindgen::{prelude::*, UnwrapThrowExt};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn decode_image(image: Vec<u8>) -> Result<Image, JsValue> {
    set_panic_hook();
    let image_data_cursor = Cursor::new(image);
    let mut decoder = Decoder::new(image_data_cursor).unwrap_throw();
    let dimensions = decoder.dimensions().unwrap_throw();
    let metadata = Metadata {
        width: dimensions.0,
        height: dimensions.1,
    };
    let decoded_img = decoder.read_image().unwrap_throw();
    let data = match decoded_img {
        DecodingResult::U8(data) => DataType::U8(data),
        DecodingResult::U16(data) => DataType::U16(data),
        DecodingResult::F32(data) => DataType::F32(data),
        _ => {
            return Err(JsValue::from(
                "Decoded image in unexpected format, must provide U8, U16 or F32 tiffs",
            ))
        }
    };

    Ok(Image::new(data, metadata))
}

#[wasm_bindgen]
pub fn to_decoded_u8(decoded_image: Image) -> Result<Vec<u8>, JsValue> {
    match decoded_image.get_data() {
        DataType::U8(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in u8 format")),
    }
}

#[wasm_bindgen]
pub fn to_decoded_u16(decoded_image: Image) -> Result<Vec<u16>, JsValue> {
    match decoded_image.get_data() {
        DataType::U16(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in u16 format")),
    }
}

#[wasm_bindgen]
pub fn to_decoded_f32(decoded_image: Image) -> Result<Vec<f32>, JsValue> {
    match decoded_image.get_data() {
        DataType::F32(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in f32 format")),
    }
}
