# Tiff-dec React Typescript example

![App in Browser](https://github.com/Schweeble/tiff-dec/blob/main/examples/ts/example.PNG)
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
componentDidMount() {
  const fetchFiles = async () => {
    try {
      const { wasm, image } = await fetchAsync();
      const decodedImage = wasm.decode_image(image);
      const metadata = decodedImage.metadata;
      const decodedImageData = wasm.to_decoded_u16(decodedImage);

      let imageHistoMinMax: ContrastParams = this.preDepth(metadata.bit_depth, wasm);
      let maxContrast = imageHistoMinMax.max;
      this.setState((previousState, _props) => {
        return {
          ...previousState,
          loaded: true,
          wasm: wasm,
          image: image,
          error: undefined,
          decodedImage: decodedImageData,
          displayImage: decodedImageData,
          imageContrast: imageHistoMinMax,
          decodedMetadata: metadata,
          maxContrast: maxContrast
        };
      });
    } catch (e) {
      this.setState((previousState, _props) => {
        return { ...previousState, loaded: false, error: e };
      });
    }
  };
  fetchFiles();
}

```

### Using tiff-dec library to decode fetched image
```typescript
render() {
  if (this.state.decodedImage &&
    this.state.decodedMetadata &&) {
    return (
    ...
      <TifCanvas
          width={this.state.decodedMetadata.width}
          height={this.state.decodedMetadata.height}
          image={this.state.decodedImage} />
    ...
}
```
