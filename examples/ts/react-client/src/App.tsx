import * as React from 'react';
import image from "./grey16.tif";
// import './App.css';
import { Metadata } from 'tiff-dec';

import { useWasm, WasmState } from "./useWasm"
import { useImage, ImageState } from './fetchImage';


function App() {


  return (
    <div className="App">
      {}
    </div>
  );
}

const decodeTif = (imageState: ImageState, wasmState: WasmState) => {
  if (imageState.loaded && wasmState.loaded) {

  }

}

export default App;
