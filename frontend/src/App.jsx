import { useEffect, useState } from "react";
import api from "./api/client";
import UploadPanel from "./components/UploadPanel";
import FileSidebar from "./components/FileSidebar";
import SearchPanel from "./components/SearchPanel";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tab, setTab] = useState("chat");

  const fetchFiles = async () => {
    const res = await api.get("/documents");
    setFiles(res.data.files || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="app-container">
      <aside>
        <UploadPanel refreshFiles={fetchFiles} />
        <FileSidebar
          files={files}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </aside>

      <main>
        <div className="tabs">
          <button onClick={() => setTab("chat")} className={tab === "chat" ? "active" : ""}>
            Chat
          </button>
          <button onClick={() => setTab("search")} className={tab === "search" ? "active" : ""}>
            Search
          </button>
        </div>

        {tab === "chat" ? (
          <ChatPanel selectedFiles={selectedFiles} />
        ) : (
          <SearchPanel selectedFiles={selectedFiles} />
        )}
      </main>
    </div>
  );
}