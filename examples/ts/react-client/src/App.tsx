import * as React from 'react';
import image from "./grey16.tif";
// import './App.css';
import { Metadata } from 'tiff-dec';

import { useWasm } from "./useWasm"


function App() {



  const wasmState = useWasm();
  return (
    <div className="App">
      {}
      <div>Image width: {metadata?.width}</div>
      <div>Image height: {metadata?.height}</div>
    </div>
  );
}

export default App;
