mod error;
pub mod image;
mod utils;

use crate::image::{Bitdepth, DataType, Image, Metadata};
use error::Error;
use std::io::Cursor;
use tiff::decoder::{Decoder, DecodingResult};
use tiff::ColorType;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn decode_image(tif_file: Vec<u8>) -> Result<Image, JsValue> {
    Ok(private_decode(tif_file)?)
}

fn private_decode(tif_file: Vec<u8>) -> Result<Image, Error> {
    let image_data_cursor = Cursor::new(tif_file);
    let mut decoder = Decoder::new(image_data_cursor)?;
    let dimensions = decoder.dimensions()?;
    let mut metadata = Metadata {
        width: dimensions.0,
        height: dimensions.1,
        bit_depth: Bitdepth::Undefined,
    };
    match decoder.colortype() {
        Ok(ColorType::Gray(_)) => {
            // do nothing, this is what we want
        },
        _ => return Err(Error::U(
                "Decoded image is not in Grayscale format, must provide U8, U16 or F32 tiffs in Grayscale format".to_string()))
    };
    let decoded_img = decoder.read_image()?;
    let data = map_decoder_result(decoded_img, &mut metadata)?;
    Ok(Image::new(data, metadata))
}

fn map_decoder_result(result: DecodingResult, metadata: &mut Metadata) -> Result<DataType, Error> {
    let data = match result {
        DecodingResult::U8(data) => {
            metadata.bit_depth = Bitdepth::U8;
            DataType::GrayU8(data)
        }
        DecodingResult::U16(data) => {
            metadata.bit_depth = Bitdepth::U16;
            DataType::GrayU16(data)
        }
        DecodingResult::F32(data) => {
            metadata.bit_depth = Bitdepth::F32;
            DataType::GrayF32(data)
        }
        _ => {
            return Err(Error::U(
                "Decoded image in unexpected format, must provide U8, U16 or F32 tiffs".to_string(),
            ));
        }
    };
    Ok(data)
}

#[wasm_bindgen]
pub fn to_decoded_u8(decoded_image: &Image) -> Result<Vec<u8>, JsValue> {
    match decoded_image.get_data() {
        DataType::GrayU8(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in u8 format")),
    }
}

#[wasm_bindgen]
pub fn to_decoded_u16(decoded_image: &Image) -> Result<Vec<u16>, JsValue> {
    match decoded_image.get_data() {
        DataType::GrayU16(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in u16 format")),
    }
}

#[wasm_bindgen]
pub fn to_decoded_f32(decoded_image: &Image) -> Result<Vec<f32>, JsValue> {
    match decoded_image.get_data() {
        DataType::GrayF32(data) => return Ok(data),
        _ => return Err(JsValue::from("Decoded image was not in f32 format")),
    }
}
