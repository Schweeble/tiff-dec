import React, { Component } from "react";
import Slider from "rc-slider";
import TifCanvas from "./TifCanvas"
import 'rc-slider/assets/index.css';


const { Range } = Slider;


const MAX_U16 = 65535;
const MAX_U8 = 255;


type ModuleType = typeof import("tiff-dec");

interface IProps {
}

interface IState {
    loaded: boolean;
    decodedImage?: Uint16Array;
    displayImage?: Uint16Array;
    decodedMetadata?: any;
    wasm?: ModuleType;
    image?: Uint8Array;
    error?: any;
    contrast: ContrastParams
}

interface ContrastParams {
    min: number;
    max: number;
}

const scale = (num: number, oldRange: ContrastParams, newRange: ContrastParams): number => {
    return Math.floor(((num - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min)) + newRange.min;
}

const rangeParams: ContrastParams = { min: 0, max: 100 }


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
            contrast: { min: 0, max: 100 }
        }
    }

    handleChange(value: number[]) {
        this.setState((previousState, _props) => {
            return { ...previousState, contrast: { min: value[0], max: value[1] } };
        });
    }

    componentDidMount() {
        const fetchFiles = async () => {
            try {
                const wasm = await import('tiff-dec');
                const image = await fetch('./lazydog.tif')
                    .then((tif) => {
                        if (tif.status < 299)
                            return tif.arrayBuffer()
                        else
                            throw new Error("could not recieve tif");
                    })
                    .then((buff) => new Uint8Array(buff));
                const decodedImage = wasm.decode_image(image);
                const metadata = decodedImage.metadata;
                const decodedImageData = wasm.to_decoded_u16(decodedImage);
                this.setState((previousState, _props) => {
                    return { ...previousState, loaded: true, wasm: wasm, image: image, error: undefined, decodedImage: decodedImageData, displayImage: decodedImageData, decodedMetadata: metadata };
                });
            } catch (e) {
                this.setState((previousState, _props) => {
                    return { ...previousState, loaded: false, error: e };
                });
            }
        };
        fetchFiles();
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevState.decodedImage && prevState.decodedMetadata && prevState.wasm && this.state.contrast !== prevState.contrast) {
            let image = prevState.decodedImage;
            const depth = prevState.decodedMetadata.bit_depth;
            let depthParams: ContrastParams = { min: 0, max: 255 };
            let sliderContrast = this.state.contrast;
            switch (depth) {
                case prevState.wasm.Bitdepth.U8:
                    depthParams = { min: 0, max: MAX_U8 };
                    break;
                case prevState.wasm.Bitdepth.U16:
                    depthParams = { min: 0, max: MAX_U16 };
                    break;
                case prevState.wasm.Bitdepth.F32:
                    this.setState({ error: "F32 tiff not supported for example" });
                    return;

            }

            let contrastParams = { min: scale(sliderContrast.min, rangeParams, depthParams), max: scale(sliderContrast.max, rangeParams, depthParams) };
            console.log(contrastParams)
            image = image.map(pixel => {
                return stretch(pixel, depthParams, contrastParams);
            });
            this.setState({ displayImage: image });
        }
    }

    render() {
        if (this.state.decodedImage && this.state.decodedMetadata && this.state.displayImage) {
            return (
                <div className="TifImage">
                    <TifCanvas width={this.state.decodedMetadata.width} height={this.state.decodedMetadata.height} image={this.state.displayImage} />
                    <Range allowCross={false} defaultValue={[0, 100]} onChange={this.handleChange.bind(this)} className="contrast-slider" />
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