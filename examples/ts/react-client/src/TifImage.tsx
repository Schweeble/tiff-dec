import React, { Component } from "react";
import Slider from "rc-slider";
import TifCanvas from "./TifCanvas"
import 'rc-slider/assets/index.css';
import { Metadata } from "tiff-dec";


const { Range } = Slider;


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

interface IState {
    loaded: boolean;
    decodedImage?: Uint16Array;
    displayImage?: Uint16Array;
    decodedMetadata?: Metadata;
    wasm?: ModuleType;
    image?: Uint8Array;
    error?: any;
    imageContrast?: ContrastParams;
    contrastSliderValue: number[];
    maxContrast: number;
}

interface ContrastParams {
    min: number;
    max: number;
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

class TifImage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loaded: false,
            decodedImage: undefined,
            displayImage: undefined,
            wasm: undefined,
            image: undefined,
            error: undefined,
            imageContrast: undefined,
            contrastSliderValue: [0, 100],
            maxContrast: 100
        }
    }

    handleContrastChange(value: number[]) {
        this.setState({ contrastSliderValue: value });
    }

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

    preDepth(depth: any, wasm: ModuleType): ContrastParams {
        switch (depth) {
            case wasm.Bitdepth.U8:
                return { min: 0, max: MAX_U8 };
            case wasm.Bitdepth.U16:
                return { min: 0, max: MAX_U16 };
            case wasm.Bitdepth.F32:
                this.setState({ error: "F32 tiff not supported for example" });
                return { min: 0, max: Number.MAX_VALUE };
            default:
                return { min: 0, max: 0 }
        }

    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevState.decodedImage && prevState.decodedMetadata &&
            prevState.wasm && prevState.imageContrast &&
            this.state.contrastSliderValue !== prevState.contrastSliderValue) {
            let image = prevState.decodedImage;
            let imageContrast = prevState.imageContrast;
            image = image.map(pixel => {
                return stretch(pixel, { min: this.state.contrastSliderValue[0], max: this.state.contrastSliderValue[1] }, imageContrast);
            });
            this.setState({ displayImage: image });
        }
    }

    render() {
        if (this.state.decodedImage &&
            this.state.decodedMetadata &&
            this.state.displayImage) {
            return (
                <div>
                    <div className="image-container">
                        <div className="tif-image">
                            <p>16-bit TIFF Decoded Image No Processing</p>
                            <TifCanvas
                                width={this.state.decodedMetadata.width}
                                height={this.state.decodedMetadata.height}
                                image={this.state.decodedImage} />
                        </div>
                        <div className="tif-image">
                            <p>16-bit TIFF Image With Image Processing</p>
                            <TifCanvas
                                width={this.state.decodedMetadata.width}
                                height={this.state.decodedMetadata.height}
                                image={this.state.displayImage} />
                        </div>
                    </div>
                    <div className="Sliders">
                        <div>
                            <p>Contrast Stretch</p>
                            <Range
                                allowCross={false}
                                onChange={this.handleContrastChange.bind(this)}
                                className="contrast-slider"
                                defaultValue={[0, this.state.maxContrast]}
                                min={0}
                                max={this.state.maxContrast} />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            let e = "";
            if (this.state.error) {
                e += " " + this.state.error;
            }
            return (
                <div className="TifImage">
                    <p>Not Loaded Yet{e}</p>

                </div >
            )
        }

    }
}

export default TifImage;