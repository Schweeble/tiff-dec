import * as wasm from './tiff_dec_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} tif_file
* @returns {Image}
*/
export function decode_image(tif_file) {
    var ptr0 = passArray8ToWasm0(tif_file, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.decode_image(ptr0, len0);
    return Image.__wrap(ret);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Image} decoded_image
* @returns {Uint8Array}
*/
export function to_decoded_u8(decoded_image) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(decoded_image, Image);
        wasm.to_decoded_u8(retptr, decoded_image.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let cachegetUint16Memory0 = null;
function getUint16Memory0() {
    if (cachegetUint16Memory0 === null || cachegetUint16Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint16Memory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachegetUint16Memory0;
}

function getArrayU16FromWasm0(ptr, len) {
    return getUint16Memory0().subarray(ptr / 2, ptr / 2 + len);
}
/**
* @param {Image} decoded_image
* @returns {Uint16Array}
*/
export function to_decoded_u16(decoded_image) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(decoded_image, Image);
        wasm.to_decoded_u16(retptr, decoded_image.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU16FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 2);
        return v0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
* @param {Image} decoded_image
* @returns {Float32Array}
*/
export function to_decoded_f32(decoded_image) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(decoded_image, Image);
        wasm.to_decoded_f32(retptr, decoded_image.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayF32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* Bitdepth enum for metadata
*/
export const Bitdepth = Object.freeze({ U16:0,"0":"U16",U8:1,"1":"U8",F32:2,"2":"F32",Undefined:3,"3":"Undefined", });
/**
* Opaque image type for JS
*/
export class Image {

    static __wrap(ptr) {
        const obj = Object.create(Image.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_image_free(ptr);
    }
    /**
    * metadata from image
    * @returns {Metadata}
    */
    get metadata() {
        var ret = wasm.__wbg_get_image_metadata(this.ptr);
        return Metadata.__wrap(ret);
    }
    /**
    * metadata from image
    * @param {Metadata} arg0
    */
    set metadata(arg0) {
        _assertClass(arg0, Metadata);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_image_metadata(this.ptr, ptr0);
    }
}
/**
* Metadata type for width and height information
*/
export class Metadata {

    static __wrap(ptr) {
        const obj = Object.create(Metadata.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadata_free(ptr);
    }
    /**
    * width of image
    * @returns {number}
    */
    get width() {
        var ret = wasm.__wbg_get_metadata_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * width of image
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_metadata_width(this.ptr, arg0);
    }
    /**
    * height of image
    * @returns {number}
    */
    get height() {
        var ret = wasm.__wbg_get_metadata_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * height of image
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_metadata_height(this.ptr, arg0);
    }
    /**
    * bitdepth of image
    * @returns {number}
    */
    get bit_depth() {
        var ret = wasm.__wbg_get_metadata_bit_depth(this.ptr);
        return ret >>> 0;
    }
    /**
    * bitdepth of image
    * @param {number} arg0
    */
    set bit_depth(arg0) {
        wasm.__wbg_set_metadata_bit_depth(this.ptr, arg0);
    }
}

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

