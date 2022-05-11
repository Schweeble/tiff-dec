import { useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
import { Tooltip } from "@mui/material";
import TifCanvas from "./TifCanvas";
import { Metadata, Image } from "tiff-dec";


const MAX_U16 = 65535;
const MAX_U8 = 255;


type ModuleType = typeof import("tiff-dec");

interface IProps {
}

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

interface ContrastParams {
    min: number;
    max: number;
}

interface Error {
    error: any
}

const scale = (num: number, oldRange: ContrastParams, newRange: ContrastParams): number => {
    let scale = Math.floor(((num - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min);
    if (scale > newRange.max)
        return newRange.max;
    if (scale < newRange.min)
        return newRange.min;
    return scale;
}

const stretch = scale;

interface Props {
    children: React.ReactElement;
    value: number;
}

function ValueLabelComponent(props: Props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

function TifImage() {
    // State variables
    const [loaded, setLoaded] = useState(false);
    const [decodedImage, setDecodedImage] = useState<Uint16Array>();
    const [displayImage, setDisplayImage] = useState<Uint16Array>();
    const [wasm, setWasm] = useState<ModuleType>();
    const [image, setImage] = useState<Uint8Array>();
    const [metadata, setMetadata] = useState<Metadata>();
    const [error, setError] = useState<Error>();
    const [imageContrast, setImageContrast] = useState<ContrastParams>();
    const [contrastSliderValue, setContrastSliderValue] = useState([0, 100]);
    const [maxContrast, setMaxContrast] = useState(100);

    // determines bit depth of image and returns contrast stretching parameters
    function preDepth(depth: any, wasm: ModuleType): ContrastParams {
        switch (depth) {
            case wasm.Bitdepth.U8:
                return { min: 0, max: MAX_U8 };
            case wasm.Bitdepth.U16:
                return { min: 0, max: MAX_U16 };
            case wasm.Bitdepth.F32:
                setError({ error: "F32 tiff not supported for example" });
                return { min: 0, max: Number.MAX_VALUE };
            default:
                return { min: 0, max: 0 }
        }
    };

    // mount the component
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
                setMetadata(loadedMetadata);
                setImage(galaxy);
                setDecodedImage(initialDecodedImageData);
                setDisplayImage(initialDecodedImageData);
                setImageContrast(imageHistoMinMax);
                setMetadata(loadedMetadata);
                setMaxContrast(maxContrast);
            } catch (e) {
                setError({ error: e });
                setLoaded(false);
            }
        }
        fetchFiles();
    }, []);

    function handleContrastChange(e: Event, value: number | number[], activeThumb: number) {
        if (Array.isArray(value)) setContrastSliderValue(value);
    };

    // contrast stretching
    useEffect(() => {
        if (loaded) {
            let image = decodedImage;
            let range = imageContrast ? imageContrast : { min: 0, max: 100 };
            image = image?.map(pixel => {
                return stretch(pixel, { min: contrastSliderValue[0], max: contrastSliderValue[1] }, range);
            });
            setDisplayImage(image);
        }
    }, [contrastSliderValue])

    return (
        <div>
            {(loaded && displayImage && decodedImage) ?
                <div>
                    <div className="image-container">
                        <div className="tif-image">
                            <p>16-bit TIFF Decoded Image No Processing</p>
                            <TifCanvas
                                width={metadata?.width}
                                height={metadata?.height}
                                image={decodedImage} />
                        </div>
                        <div className="tif-image">
                            <p>16-bit TIFF Image With Image Processing</p>
                            <TifCanvas
                                width={metadata?.width}
                                height={metadata?.height}
                                image={displayImage} />
                        </div>
                    </div>
                    <div className="Sliders">
                        <div>
                            <p>Contrast Stretch</p>
                            <Slider
                                valueLabelDisplay="auto"
                                components={{
                                    ValueLabel: ValueLabelComponent,
                                }}
                                aria-label="custom thumb label"
                                defaultValue={[0, maxContrast]}
                                onChange={handleContrastChange}
                                min={0}
                                max={maxContrast}
                                style={{
                                    width: "40%"
                                }}
                            />
                        </div>
                    </div>
                </div> :
                <div className="TifImage">
                    <p>Not Loaded Yet {error?.error}</p>

                </div >
            }
        </div>
    );

}

export default TifImage;