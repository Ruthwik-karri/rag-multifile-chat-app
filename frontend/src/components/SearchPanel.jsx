import { useState } from "react";
import api from "../api/client";

export default function SearchPanel({ selectedFiles }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await api.post("/search", {
      query,
      file_ids: selectedFiles,
      top_k: 5,
    });
    setResults(res.data.results);
  };

  return (
    <div className="panel">
      <h2>File Search</h2>
      <div className="row">
        <input
          type="text"
          placeholder="Search inside files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {results.map((item, idx) => (
          <div key={idx} className="result-card">
            <h4>{item.file_name}</h4>
            <p><strong>Page:</strong> {item.page ?? "N/A"}</p>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}