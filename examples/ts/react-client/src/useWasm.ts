import { useEffect, useState } from 'react';

type ModuleType = typeof import("tiff-dec");

type WasmState = {
    loaded?: boolean;
    wasm?: ModuleType;
    error: any;
}

export const useWasm = () => {
    const [wasmState, setWasmState] = useState<WasmState>();
    useEffect(() => {
        const fetchWasm = async () => {
            try {
                const wasm = await import('tiff-dec');
                setWasmState({ loaded: true, wasm, error: undefined });
            } catch (e) {
                setWasmState({ ...wasmState, error: e });
            }
        };
        fetchWasm();
    }, []);
    return wasmState;
}