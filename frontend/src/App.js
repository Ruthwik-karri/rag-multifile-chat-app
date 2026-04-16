import { useEffect, useRef, useState } from "react";
import "./index.css";
import api from "./api/client";

const WELCOME_MESSAGE =
  "Hello! I'm your RAG assistant. Upload documents and ask me anything about them. I'll search through your uploaded files and return the most relevant answer.";

export default function App() {
  const [history, setHistory] = useState([
    {
      id: crypto.randomUUID(),
      title: "New conversation",
      subtitle: "Start a new conversation",
      messages: [{ role: "assistant", content: WELCOME_MESSAGE, sources: [] }],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [chatSearch, setChatSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChatId && history.length > 0) {
      setActiveChatId(history[0].id);
    }
  }, [history, activeChatId]);

  const activeChat =
    history.find((chat) => chat.id === activeChatId) || history[0];

  const scrollToBottom = (behavior = "smooth") => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [history, isSending]);

  const updateActiveChat = (updater) => {
    setHistory((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, ...updater(chat) } : chat
      )
    );
  };

  const createNewChat = () => {
    const newChat = {
      id: crypto.randomUUID(),
      title: "New conversation",
      subtitle: "Start a new conversation",
      messages: [{ role: "assistant", content: WELCOME_MESSAGE, sources: [] }],
    };

    setHistory((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessage("");
    setUploadedFiles([]);
    setSelectedFileIds([]);
  };

  const deleteChat = (chatId) => {
    setHistory((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);

      if (updated.length === 0) {
        const fallback = {
          id: crypto.randomUUID(),
          title: "New conversation",
          subtitle: "Start a new conversation",
          messages: [{ role: "assistant", content: WELCOME_MESSAGE, sources: [] }],
        };
        setActiveChatId(fallback.id);
        return [fallback];
      }

      if (chatId === activeChatId) {
        setActiveChatId(updated[0].id);
      }

      return updated;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setIsUploading(true);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = res?.data?.files || [];

      setUploadedFiles((prev) => {
        const merged = [...prev];
        uploaded.forEach((file) => {
          if (!merged.some((f) => f.file_id === file.file_id)) {
            merged.push(file);
          }
        });
        return merged;
      });

      setSelectedFileIds((prev) => {
        const ids = new Set(prev);
        uploaded.forEach((file) => ids.add(file.file_id));
        return Array.from(ids);
      });

      scrollToBottom();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error?.response?.data?.detail || "File upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeUploadedFileChip = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.file_id !== fileId));
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const userText = message.trim();
    setMessage("");

    updateActiveChat((chat) => ({
      messages: [...chat.messages, { role: "user", content: userText }],
      title:
        chat.title === "New conversation" ? userText.slice(0, 32) : chat.title,
      subtitle: "Conversation in progress",
    }));

    scrollToBottom();

    try {
      setIsSending(true);

      const res = await api.post("/chat", {
        question: userText,
        file_ids: selectedFileIds.length ? selectedFileIds : null,
        top_k: 4,
      });

      updateActiveChat((chat) => ({
        messages: [
          ...chat.messages,
          {
            role: "assistant",
            content: res?.data?.answer || "No answer received.",
            sources: res?.data?.sources || [],
          },
        ],
      }));

      setUploadedFiles([]);
      setSelectedFileIds([]);
    } catch (error) {
      console.error("Chat failed:", error);

      updateActiveChat((chat) => ({
        messages: [
          ...chat.messages,
          {
            role: "assistant",
            content:
              error?.response?.data?.detail ||
              "Something went wrong while getting the answer.",
            sources: [],
          },
        ],
      }));
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="app-shell">
      <div className="main-layout">
        <section className="chat-section">
          <header className="topbar">
            <div className="brand-block">
              <div className="brand-icon">✦</div>
              <div>
                <h1 className="brand-title">RAG Chat</h1>
                <p className="brand-subtitle">LangChain + Groq</p>
              </div>
            </div>
          </header>

          <div className="chat-body">
            <div className="messages-container">
              {activeChat?.messages?.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`message-row ${
                    msg.role === "user" ? "user-row" : "assistant-row"
                  }`}
                >
                  <div className={msg.role === "user" ? "user-card" : "assistant-message"}>
                    {msg.role === "assistant" && (
                      <div className="assistant-avatar">🤖</div>
                    )}

                    <div className="assistant-content">
                      <div className="assistant-name">
                        {msg.role === "assistant" ? "Assistant" : "You"}
                      </div>
                      <p>{msg.content}</p>

                      {msg.role === "assistant" && msg.sources?.length > 0 && (
                        <details className="sources-details">
                          <summary>View sources</summary>
                          <div className="sources-block">
                            {msg.sources.map((source, sourceIndex) => (
                              <div className="source-card" key={sourceIndex}>
                                <div className="source-header">
                                  <span className="source-file">{source.file_name}</span>
                                  <span className="source-page">
                                    Page: {source.page ?? "N/A"}
                                  </span>
                                </div>
                                <div className="source-text">{source.text}</div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="message-row assistant-row">
                  <div className="assistant-message">
                    <div className="assistant-avatar">🤖</div>
                    <div className="assistant-content">
                      <div className="assistant-name">Assistant</div>
                      <p>Thinking...</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="composer-wrapper">
            {uploadedFiles.length > 0 && (
              <div className="file-chip-row">
                {uploadedFiles.map((file) => (
                  <div key={file.file_id} className="file-chip">
                    <span className="file-chip-icon">📄</span>
                    <span className="file-chip-text">{file.file_name}</span>
                    <button
                      className="file-chip-close"
                      type="button"
                      onClick={() => removeUploadedFileChip(file.file_id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="composer-bar">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileUpload}
              />

              <button
                className="attach-btn"
                type="button"
                onClick={openFileDialog}
                disabled={isUploading}
                title="Attach files"
              >
                {isUploading ? "..." : "📎"}
              </button>

              <input
                type="text"
                placeholder="Ask anything about your documents..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button
                className="send-btn"
                type="button"
                onClick={handleSend}
                disabled={isSending}
                title="Send"
              >
                ➤
              </button>
            </div>

            <div className="footer-note">
              Connected to your RAG backend · LangChain + Groq
            </div>
          </div>
        </section>

        <aside className="history-panel">
          <div className="history-top">
            <h2>History</h2>
            <div className="history-actions">
              <button className="icon-btn" type="button" onClick={createNewChat}>
                ＋
              </button>
            </div>
          </div>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search chats..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          <div className="history-list">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`history-card ${
                  item.id === activeChatId ? "active-history-card" : ""
                }`}
                onClick={() => setActiveChatId(item.id)}
              >
                <div className="history-card-icon">◻</div>
                <div className="history-card-content">
                  <div className="history-card-title">{item.title}</div>
                  <div className="history-card-subtitle">{item.subtitle}</div>
                </div>
                <button
                  className="history-delete-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(item.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}