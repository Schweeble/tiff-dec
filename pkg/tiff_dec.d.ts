/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} tif_file
* @returns {Image}
*/
export function decode_image(tif_file: Uint8Array): Image;
/**
* @param {Image} decoded_image
* @returns {Uint8Array}
*/
export function to_decoded_u8(decoded_image: Image): Uint8Array;
/**
* @param {Image} decoded_image
* @returns {Uint16Array}
*/
export function to_decoded_u16(decoded_image: Image): Uint16Array;
/**
* @param {Image} decoded_image
* @returns {Float32Array}
*/
export function to_decoded_f32(decoded_image: Image): Float32Array;
/**
* Bitdepth enum for metadata
*/
export enum Bitdepth {
  U16,
  U8,
  F32,
  Undefined,
}
/**
* Opaque image type for JS
*/
export class Image {
  free(): void;
/**
* metadata from image
* @returns {Metadata}
*/
  metadata: Metadata;
}
/**
* Metadata type for width and height information
*/
export class Metadata {
  free(): void;
/**
* bitdepth of image
* @returns {number}
*/
  bit_depth: number;
/**
* height of image
* @returns {number}
*/
  height: number;
/**
* width of image
* @returns {number}
*/
  width: number;
}
