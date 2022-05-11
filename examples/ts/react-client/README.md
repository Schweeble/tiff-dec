# Tiff-dec React Typescript example

![App in Browser](https://github.com/Schweeble/tiff-dec/blob/main/examples/ts/example.PNG)

## steps to recreate base app

```bash
npx create-react-app react-client --template typescript

npm install react-app-rewired wasm-loader -D
```

## install from npm

```bash
npm install
```

## run with npm

```bash
npm run start
```

## Example usage

### async import of wasm module

```typescript
// Fetches asynchronous files and dependencies
const fetchAsync = async () => {
    const wasm = await import('tiff-dec');
    const image = await fetch('./m51.tif')
        .then((tif) => {
            if (tif.status < 299)
                return tif.arrayBuffer()
            else
                throw new Error("could not recieve tif");
        })
        .then((buff) => new Uint8Array(buff));
    return { wasm, image };
}

...

// mount the component and decode images
// images can be decoded anytime after the
// wasm is loaded
useEffect(() => {
    const fetchFiles = async () => {
        try {
            const { wasm: wasmModule, image: galaxy } = await fetchAsync();
            const initialDecodedImage = wasmModule.decode_image(galaxy);
            const loadedMetadata = initialDecodedImage.metadata;
            const initialDecodedImageData = wasmModule.to_decoded_u16(initialDecodedImage);

            let imageHistoMinMax: ContrastParams = preDepth(loadedMetadata.bit_depth, wasmModule);
            let maxContrast = imageHistoMinMax.max;
            setLoaded(true);
            setWasm(wasmModule);

            ... 
            
        } catch (e) {
            setError({ error: e });
            setLoaded(false);
        }
    }
    fetchFiles();
}, []);



```

### Using tiff-dec library to decode fetched image

```typescript
render() {
  if (this.state.decodedImage &&
    this.state.decodedMetadata) {
    return (
    ...
      <TifCanvas
          width={this.state.decodedMetadata.width}
          height={this.state.decodedMetadata.height}
          image={this.state.decodedImage} />
    ...
}
```
