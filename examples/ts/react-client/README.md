# Tiff-dec React Typescript example

![App in Browser](http://github.com/Schweeble/tiff-dec/examples/ts/react-client/example.png)
# steps to recreate base app

```
npx create-react-app react-client --template typescript

npm install react-app-rewired wasm-loader -D
```

## install from npm

```
npm install
```

## run with npm

```
npm run start
```

## Example usage

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