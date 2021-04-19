import React from "react";
import { useEffect, useState } from "react";
import { useImage } from "./fetchImage";
import { useWasm } from "./useWasm";

const ImageLoad = React.memo(() => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // start loading original image
        const wasmState = useWasm();
        const imageState = useImage();
    }, [])

    return (
        <img
            src={ }
            style={{
                opacity: loading ? 0.5 : 1,
                transition: "opacity .15s linear"
            }}
            alt={alt}
        />
    )
});

export default ImageLoad;