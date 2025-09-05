

export default function RecordingList({recordings}) {
    return (
        <div className="recordings">
            <h2> Upload Recordings</h2>
            <div className="grid">
                {recordings.map((rec) => (
                    <div key={rec.id}>
                       <span>{rec.filename}</span> 
                       <video 
                       src={`https://recorder-backend-1-v1ja.onrender.com/api/recordings/${rec.id}`}
                       controls></video>
                     </div>  
                ))}
            </div>
            </div>
    );
}
