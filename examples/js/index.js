import * as wasm from "tiff-dec";

let tif = fetch("./img/grey8.tif")
    .then((res) => res.arrayBuffer())
    .then((buf) => {
        var uint8 = new Uint8Array(buf);
        return new Promise((resolve, reject) => {
            const img = wasm.decode_image(uint8);

            const metadata = img.metadata;

            const decoded = wasm.to_decoded_u8(img);
            resolve({ data: decoded, metadata: metadata });
        });
    });

tif.then((decoded) => {
    console.log(decoded.data.length);
    console.log("width: ", decoded.metadata.width, " height: ", decoded.metadata.height);
});