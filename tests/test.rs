// Library tests
#[cfg(test)]
mod test {
    use std::{env, fs::File, io::Read, path::PathBuf};
    use tiff_dec::image::Image;
    use tiff_dec::*;
    #[test]
    fn test_decode_8bit() {
        let image = decode("resources/test/grey8.tif");
        let metadata = image.metadata;
        let data = to_decoded_u8(&image).expect("Not in proper format (u8 grayscale)");
        assert_eq!((metadata.width * metadata.height), data.len() as u32);
    }

    #[test]
    fn test_decode_16bit() {
        let image: image::Image = decode("resources/test/grey16.tif");
        let metadata = image.metadata;
        let data = to_decoded_u16(&image).expect("Not in proper format (u8 grayscale)");
        assert_eq!((metadata.width * metadata.height), data.len() as u32);
    }

    // TODO: Find f32 greyscale tif test image and test it

    fn decode(resource_path: &str) -> Image {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(resource_path);
        let mut file = File::open(&path).expect("Could not open resource file");
        let mut buffer = Vec::<u8>::new();
        file.read_to_end(&mut buffer)
            .expect("Could not read file to buffer");
        decode_image(buffer).expect("Could not decode image")
    }
}
