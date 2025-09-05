
export default function RecorderControls({isRecording, timer, onStart, onStop}) {
    return (
        <div className="controls">
            <button className={`record-btn ${isRecording ? "recording" : ""}`}
            onClick={isRecording ? onStop : onStart}>
                {isRecording ? "Stop" : "Start" }
            </button>
            <span className="timer">{timer}s</span>
        </div>
    );
}