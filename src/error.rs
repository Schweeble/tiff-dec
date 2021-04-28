use thiserror::Error;
use wasm_bindgen::JsValue;

#[derive(Error, Debug)]
pub enum Error {
    #[error("data store disconnected")]
    Decoding(#[from] tiff::TiffError),
    #[error("Ran into internal error")]
    U(String),
}

impl From<Error> for JsValue {
    fn from(e: Error) -> JsValue {
        return JsValue::from(&e.to_string());
    }
}
