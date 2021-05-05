import React, {useCallback, useRef, useState} from 'react';
import Webcam from "react-webcam";

import '../../App.css'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const WebCam = () => {
    const webcamRef = useRef<Webcam>(null);
    const [img, setImg] = useState<string | null>(null)

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot()
            setImg(imageSrc)
            console.log(imageSrc)
        }
    }, [webcamRef])

    return (
        <div className='webCam'>
            <Webcam
                audio={false}
                height={500}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={700}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
            {img && <img src={img} alt=""/>}

        </div>
    );
}

export default WebCam;