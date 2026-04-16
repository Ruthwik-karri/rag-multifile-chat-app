import { useState } from "react";
import api from "../api/client";

export default function UploadPanel({ refreshFiles }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!files.length) return;
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      setLoading(true);
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      refreshFiles();
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Files</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}