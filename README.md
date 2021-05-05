# tiff-dec

[![NPM version][npm-image]][cl] ![MIT][li] [![docs][di]][dl] ![LoC][lo] ![Tests][btl] ![Lints][bll]

[npm-image]: https://img.shields.io/npm/v/tiff-dec.svg
[cl]: https://www.npmjs.com/package/tiff-dec

[li]: https://img.shields.io/badge/license-MIT-blue

[di]: https://img.shields.io/badge/Documentation-GithubPages-blue
[dl]: https://schweeble.github.io/tiff-dec/

[lo]: https://tokei.rs/b1/github/Schweeble/tiff-dec?category=code

[btl]: https://github.com/schweeble/tiff-dec/workflows/unit-tests/badge.svg
[bll]: https://github.com/schweeble/tiff-dec/workflows/lints/badge.svg


Javascript TIFF file decoder library built using wasm-pack and Rust.

## Example - Vanilla JS

```javascript
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
```

Check out the full example in [examples/js](https://github.com/Schweeble/tiff-dec/tree/main/examples/js)


## Example - React with Typescript

[examples/ts](http://github.com/Schweeble/tiff-dec/tree/main/examples/ts/react-client)




### Building JS/Wasm package from source

Check out [wasm-pack](https://github.com/rustwasm/wasm-pack) here for more information
