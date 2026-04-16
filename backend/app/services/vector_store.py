import os
from langchain_community.vectorstores import FAISS
from app.services.embedding_service import get_embeddings
from app.config import FAISS_INDEX_DIR

class VectorStoreService:
    def __init__(self):
        self.embeddings = get_embeddings()

    def load(self):
        index_file = os.path.join(FAISS_INDEX_DIR, "index.faiss")
        if os.path.exists(index_file):
            return FAISS.load_local(
                FAISS_INDEX_DIR,
                self.embeddings,
                allow_dangerous_deserialization=True
            )
        return None

    def save(self, vectorstore):
        vectorstore.save_local(FAISS_INDEX_DIR)

    def add_documents(self, docs):
        current_store = self.load()
        if current_store is None:
            current_store = FAISS.from_documents(docs, self.embeddings)
        else:
            current_store.add_documents(docs)

        self.save(current_store)
        return current_store

    def similarity_search(self, query, k=5, file_ids=None):
        store = self.load()
        if store is None:
            return []

        docs = store.similarity_search(query, k=max(k * 4, 10))

        if file_ids:
            docs = [doc for doc in docs if doc.metadata.get("file_id") in file_ids]

        return docs[:k]