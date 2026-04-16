# 🚀 RAG Multi-File Chat App

A production-style **Retrieval-Augmented Generation (RAG)** system that allows users to upload multiple documents and perform intelligent question answering using **FastAPI, React, LangChain, FAISS, Hugging Face embeddings, and Groq LLM**.

---

## ✨ Features

* 📂 Multi-file upload support
* 🔍 Semantic search using FAISS vector database
* 🤖 AI-powered question answering
* 🧠 Retrieval-Augmented Generation (RAG)
* ⚡ FastAPI backend for high performance
* 🎨 Clean React-based chat UI
* 📄 Source-based answers (with document references)
* 💬 Conversation-style interface

---

## 🧠 How It Works

### 📥 File Upload Pipeline

1. Upload documents (PDF, DOCX, TXT)
2. Extract text from files
3. Split text into chunks
4. Convert chunks into embeddings
5. Store embeddings in FAISS vector database

---

### ❓ Question Answering Flow

1. User asks a question
2. Question is converted into embedding
3. FAISS retrieves most relevant chunks
4. Context is sent to LLM (Groq)
5. LLM generates final answer

---

## 🛠 Tech Stack

### 🔹 Frontend

* React.js
* Axios
* CSS

### 🔹 Backend

* FastAPI
* Python
* LangChain
* FAISS
* Hugging Face Embeddings
* Groq API

---

## 📁 Project Structure

```bash
rag-multifile-chat-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schema.py
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   ├── documents.py
│   │   │   ├── search.py
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   ├── document_load.py
│   │   │   ├── text_splitter.py
│   │   │   ├── embedding_service.py
│   │   │   ├── vector_store.py
│   │   │   ├── file_registry.py
│   │   │   └── rag_service.py
│   │   └── utils/
│   ├── storage/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 🔹 Clone the repo

```bash
git clone https://github.com/Ruthwik-karri/rag-multifile-chat-app.git
cd rag-multifile-chat-app
```

---

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```env
GROQ_API_KEY=your_api_key_here
EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2
GROQ_MODEL=qwen/qwen3-32b
```

Run backend:

```bash
uvicorn app.main:app --reload
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm install axios
npm start
```

---

## 📡 API Endpoints

| Endpoint         | Method | Description         |
| ---------------- | ------ | ------------------- |
| `/api/upload`    | POST   | Upload files        |
| `/api/documents` | GET    | List uploaded files |
| `/api/search`    | POST   | Semantic search     |
| `/api/chat`      | POST   | Ask questions       |

---

## 🚀 Use Cases

* Resume Q&A system
* Document-based chatbot
* Knowledge base assistant
* Multi-file semantic search system

---

## ⚠️ Important Notes

* Do NOT upload `.env` file
* API keys must be kept secret
* FAISS index stored locally
* Designed for local / demo use (can be extended to production)

---

## 🔮 Future Improvements

* User authentication
* Cloud storage (S3, GCP)
* Streaming responses
* Chat history persistence
* Reranking for better accuracy

---

## 👨‍💻 Author

**Ruthwik Karri**
AI/ML Developer

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
