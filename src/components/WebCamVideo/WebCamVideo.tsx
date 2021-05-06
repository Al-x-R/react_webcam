import React, {useCallback, useEffect, useRef, useState} from 'react';
import Webcam from "react-webcam";

const WebCamVideo = () => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<any>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoUrl, setVideoUrl] = useState<string | null >(null)

    const [img, setImg] = useState<string | null>(null)
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot()
            setImg(imageSrc)
        }
    }, [webcamRef])

    const handleStartCaptureClick = useCallback(() => {
        if (webcamRef.current) {
            setCapturing(true);
            if (mediaRecorderRef) {
                if (webcamRef.current.stream) {
                    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                        mimeType: "video/webm",
                        audioBitsPerSecond : 128000
                    });
                }
                if (mediaRecorderRef.current) {
                    mediaRecorderRef.current.addEventListener(
                        "dataavailable",
                        handleDataAvailable
                    );
                    mediaRecorderRef.current.start();
                }
            }
        }
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    useEffect(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            setVideoUrl(URL.createObjectURL(blob))
        }
    }, [recordedChunks])
    // const handleDownload = useCallback(() => {
    //     if (recordedChunks.length) {
    //         const blob = new Blob(recordedChunks, {
    //             type: "video/webm"
    //         });
    //         console.log('blob', blob)
    //         const url = URL.createObjectURL(blob);
    //         setVideoUrl(url)
    //         console.log('url', url.trimRight())
    //         const a = document.createElement("a");
    //         document.body.appendChild(a);
    //         // a.style = "display: none";
    //         a.href = url;
    //         a.download = "react-webcam-stream-capture.webm";
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //         setRecordedChunks([]);
    //     }
    // }, [recordedChunks]);
    const handleClearVideo = useCallback(() => {
        if (videoUrl) {
            setVideoUrl(null);
            window.URL.revokeObjectURL(videoUrl)
            setRecordedChunks([])
        }
    }, [videoUrl])

    const handleClearPhoto = useCallback(() => {
        if (img) {
            setImg(null);
        }
    }, [img])

    return (
        <div>
            <>
                <Webcam audio={true}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        />
                {capturing ? (
                    <button onClick={handleStopCaptureClick}>Stop Capture</button>
                ) : (
                    <button onClick={handleStartCaptureClick}>Start Capture</button>
                )}
                <button onClick={capture}>Capture photo</button>
                {img && <div>
                    <img src={img} alt=""/>
                    <button onClick={handleClearPhoto}>Clear</button>
                </div>}
                {videoUrl && <div>
                    <video controls={true} src={videoUrl}/>
                    <button onClick={handleClearVideo}>Clear</button>
                </div> }
            </>
        </div>
    );
};

export default WebCamVideo;