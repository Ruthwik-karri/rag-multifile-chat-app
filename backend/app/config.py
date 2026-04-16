import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORAGE_DIR = os.path.join(BASE_DIR, "storage")
UPLOAD_DIR = os.path.join(STORAGE_DIR, "uploads")
FAISS_INDEX_DIR = os.path.join(STORAGE_DIR, "faiss_index")
REGISTRY_FILE = os.path.join(STORAGE_DIR, "file_registry.json")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2")
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3-32b")

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx"}

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(FAISS_INDEX_DIR, exist_ok=True)