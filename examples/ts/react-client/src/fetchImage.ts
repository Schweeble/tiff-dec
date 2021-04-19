import { useEffect, useState } from "react";

export type ImageState = {
  loaded?: boolean;
  image?: Uint8Array;
  error?: any;
}

export const useImage = () => {
  const [imageState, setImageState] = useState<ImageState>();
  useEffect(() => {
    const fetchTif = async () => {
      try {
        const image = await fetch('./grey16.tif').then((tif) => tif.arrayBuffer()).then((buff) => {
          return new Uint8Array(buff);
        });
        setImageState({ loaded: true, image: image, error: undefined });
      } catch (e) {
        setImageState({ ...imageState, error: e });
      }
    }
    fetchTif();
  }, []);
  return imageState;
}