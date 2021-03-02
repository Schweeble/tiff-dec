import * as wasm from "tiff-dec";

let tif = await fetch("img/grey8.tif")
    .then((res) => res.arrayBuffer())
    .then((buf) => {
        var uint8 = new Uint8Array(buf);
        return new Promise((resolve, reject) => {
            const img = wasm.decode_image(uint8);
            var decoded = wasm.to_decoded_u8(img);
            resolve(decoded);
        });
    });

console.log(tif.len)
