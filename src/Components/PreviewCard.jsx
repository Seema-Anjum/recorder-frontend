

export default function PreviewCard({videoURL, onDownload, onUpload}) {
    return (
        <div className="card">
            <h2>Preview </h2>
            <video src={videoURL} controls></video>  
            <div className="action-buttons">
                <button className="download-btn" onClick={onDownload}>Download</button>
                <button className="upload-btn" onClick={onUpload}>Upload</button>
            </div>  
        </div>
    );
}