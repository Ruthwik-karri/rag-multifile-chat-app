export default function FileSidebar({ files, selectedFiles, setSelectedFiles }) {
  const toggleFile = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  return (
    <div className="sidebar">
      <h3>Files</h3>
      {files.map((file) => (
        <label key={file.file_id} className="file-item">
          <input
            type="checkbox"
            checked={selectedFiles.includes(file.file_id)}
            onChange={() => toggleFile(file.file_id)}
          />
          <span>{file.file_name}</span>
        </label>
      ))}
    </div>
  );
}