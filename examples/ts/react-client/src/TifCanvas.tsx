import React, { useRef, useEffect } from 'react';

interface TifCanvasProps {
    width: number;
    height: number;
    image: Uint16Array;
}

const TifCanvas = ({ width, height, image }: TifCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context == null) throw new Error("Context is null");
            const imageData = context.createImageData(width, height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const uint8 = Math.floor(image[Math.floor(i / 4)] / 256);
                imageData.data[i] = uint8;
                imageData.data[i + 1] = uint8;
                imageData.data[i + 2] = uint8;
                imageData.data[i + 3] = 255;
            }
            context.putImageData(imageData, 0, 0);

        }
    });

    return <canvas ref={canvasRef} height={height} width={width} />;
};

TifCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default TifCanvas;