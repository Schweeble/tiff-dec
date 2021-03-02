use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
/// Opaque image type for JS
pub struct Image {
    /// data holds the various data types for this object, not visible to JS
    data: DataType,
    /// metadata from image
    metadata: Metadata,
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
/// Metadata type for width and height information
pub struct Metadata {
    /// width of image
    pub width: u32,
    /// height of image
    pub height: u32,
}

impl Image {
    /// Sets the data for an image
    pub fn set_data(&mut self, data: DataType) {
        self.data = data;
    }

    /// Gets the data for an image
    pub fn get_data(&self) -> DataType {
        self.data.clone()
    }

    /// Sets the metadata for an image
    pub fn set_metadata(&mut self, metadata: Metadata) {
        self.metadata = metadata;
    }

    /// Gets the metadata for an image
    pub fn get_metadata(&self) -> Metadata {
        self.metadata.clone()
    }

    /// Creates a new Image
    pub fn new(data: DataType, metadata: Metadata) -> Self {
        Self { data, metadata }
    }
}

#[derive(Clone, Debug, PartialEq)]
/// DataType enum to hold various decoded tiff types, not visible to JS
pub enum DataType {
    U16(Vec<u16>),
    U8(Vec<u8>),
    F32(Vec<f32>),
}
