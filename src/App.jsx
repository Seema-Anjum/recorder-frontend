import {useState, useEffect, useRef} from "react";
import RecorderControls from "./Components/RecorderControls";
import PreviewCard from "./Components/PreviewCard";
import RecordingsList from "./Components/RecordingsList";
import "./app.css"

export default function App() {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [videoURL, setVideoURL] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [recordings, setRecordings] = useState([]);
    const timerRef = useRef(null);

    // Function to start recording
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const localChunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                localChunks.push(e.data);
            }
        }

        recorder.onstop = () => {
            const blob = new Blob(localChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoURL(url);
            // Do not push local blob URLs to recordings state
        }

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setChunks(localChunks);
        startTimer();
    }
// Function to stop recording
    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
        stopTimer();
    }

    // timer function 
    const startTimer = () => {
        setTimer(0);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev >= 180) { // stop at 3 minutes
                    stopRecording();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);
    };

   const stopTimer = ()  => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTimer(0);
   };

   // Function to download Recording

   const downloadRecording = () => {
    if (!videoURL) return;
    const a = document.createElement("a");
    a.href = videoURL;
    a.download = "recording.webm";
    a.click();
   };

   // Function to upload the recording to the server 
   const uploadRecording = async () => {
    if (!chunks.length) return;
    const blob = new Blob(chunks, {type: "video/webm"});
    const formData = new FormData();
    formData.append("video", blob, "recording.webm");

    try {
        const res = await fetch("http://localhost:5000/api/recordings", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            fetchRecordings();
            alert("Upload successful!");
        }
    } catch (error) {
        console.error("upload failed", error);
        alert("Upload failed. Please try again.");
    }
   };

   // Fetch recordings from the server
   const fetchRecordings = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/recordings");
        const data = await res.json();
        setRecordings(data);
    } catch (error) {
        console.log("Failed to fetch recordings", error);
    }
   };

   useEffect(() => {
    fetchRecordings();
   }, []); 

   return (
    <div className="container">
        <h1> Screen Recorder </h1>
        <RecorderControls 
        isRecording={isRecording}
        timer={timer}
        onStart={startRecording}
        onStop={stopRecording} 
        />
       {videoURL && (
        <PreviewCard 
        videoURL={videoURL}
        onDownload={downloadRecording}
        onUpload={uploadRecording} 
        />
       )} 
       <RecordingsList recordings={recordings} />
    </div>
   );
}
