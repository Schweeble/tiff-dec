# tiff-dec

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

### async import of wasm module
```typescript
const fetchFiles = async () => {
    try {
        const wasm = await import('tiff-dec');
        const image = fetch('./grey16.tif')
            .then((tif) => {
                if (tif.status < 299)
                    return tif.arrayBuffer()
                else
                    throw new Error("could not recieve tif");
            })
            .then((buff) => {
                return new Promise<FetchData>((resolve, reject) => {
                    resolve({ data: new Uint8Array(buff) });
                });
            });
        const awaited = await image;
        this.setState((previousState, _props) => {
            return { ...previousState, loaded: true, wasm: wasm, image: awaited.data, error: undefined };
        });
    } catch (e) {
        this.setState((previousState, _props) => {
            return { ...previousState, loaded: false, error: e };
        });
    }
};
fetchFiles();
```

### Using tiff-dec library to decode fetched image
```typescript
render() {
    const curState = this.state;
    if (curState.loaded === true && curState.image && curState.wasm) {
        let wasm = curState.wasm;
        const decodedImage = wasm.decode_image(curState.image);
        const metadata = decodedImage.metadata;
        const decodedImageData = wasm.to_decoded_u16(decodedImage);
        return (
            <div className="TifImage">
                <TifCanvas width={metadata.width} height={metadata.height} image={decodedImageData} />
            </div>
        );
    }
    ...
}
```




### Building JS/Wasm package from source

Check out [wasm-pack](https://github.com/rustwasm/wasm-pack) here for more information
