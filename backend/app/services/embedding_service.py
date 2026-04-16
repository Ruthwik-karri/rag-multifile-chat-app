from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from app.config import EMBEDDING_MODEL

def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)