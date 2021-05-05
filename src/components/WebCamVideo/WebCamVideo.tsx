import React, {useRef, useState} from 'react';
import Webcam from "react-webcam";

const WebCamVideo = () => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef< HTMLElement | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);



    const handleStartCaptureClick = React.useCallback(() => {
        if (webcamRef.current) {
            setCapturing(true);
            if (mediaRecorderRef) {
                mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                    mimeType: "video/webm"
                });
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

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    return (
        <div>
            <>
                <Webcam audio={false} ref={webcamRef} />
                {capturing ? (
                    <button onClick={handleStopCaptureClick}>Stop Capture</button>
                ) : (
                    <button onClick={handleStartCaptureClick}>Start Capture</button>
                )}
                {recordedChunks.length > 0 && (
                    <button onClick={handleDownload}>Download</button>
                )}
            </>
        </div>
    );
};

export default WebCamVideo;