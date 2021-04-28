import React, { Component } from "react";
import TifCanvas from "./TifCanvas"

type ModuleType = typeof import("tiff-dec");

interface IProps {
}

interface IState {
    loaded: boolean;
    wasm?: ModuleType;
    image?: Uint8Array;
    error: any;
}

interface FetchData {
    data: Uint8Array;
}

class TifImage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loaded: false,
            wasm: undefined,
            image: undefined,
            error: undefined
        }
    }

    componentDidMount() {
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
    }

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
        else {
            let e = "";
            if (curState.error) {
                e += " " + curState.error;
            }
            return (
                <p>Not Loaded Yet{e}</p>
            )
        }

    }
}

export default TifImage;