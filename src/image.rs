use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct Image {
    data: DataType,
    metadata: Metadata,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Metadata {
    pub width: u32,
    pub height: u32,
}

impl Image {
    pub fn set_data(&mut self, data: DataType) {
        self.data = data;
    }

    pub fn get_data(&self) -> DataType {
        self.data.clone()
    }

    pub fn set_metadata(&mut self, metadata: Metadata) {
        self.metadata = metadata;
    }

    pub fn get_metadata(&self) -> Metadata {
        self.metadata.clone()
    }

    pub fn new(data: DataType, metadata: Metadata) -> Self {
        Self { data, metadata }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum DataType {
    U16(Vec<u16>),
    U8(Vec<u8>),
    F32(Vec<f32>),
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TifFile {
    data: Vec<u8>,
}
