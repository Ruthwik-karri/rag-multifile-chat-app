import { useState } from "react";
import api from "../api/client";

export default function ChatPanel({ selectedFiles }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.post("/chat", {
        question,
        file_ids: selectedFiles,
        top_k: 4,
      });
      setAnswer(res.data.answer);
      setSources(res.data.sources);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Ask Questions</h2>
      <div className="row">
        <input
          type="text"
          placeholder="Ask about the uploaded files..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={askQuestion} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="answer-box">
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="sources">
          <h3>Sources</h3>
          {sources.map((src, idx) => (
            <div key={idx} className="result-card">
              <h4>{src.file_name}</h4>
              <p><strong>Page:</strong> {src.page ?? "N/A"}</p>
              <p>{src.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}