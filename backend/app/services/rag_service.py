from fastapi import HTTPException
from langchain_groq import ChatGroq
from langchain_core.documents import Document

from app.config import GROQ_API_KEY, GROQ_MODEL
from app.services.vector_store import VectorStoreService

vector_service = VectorStoreService()


def get_llm():
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing. Add it in backend/.env and restart backend."
        )

    return ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        temperature=0,
        max_retries=2,
    )


def build_context(docs: list[Document]) -> str:
    context_parts = []
    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("file_name", "Unknown")
        page = doc.metadata.get("page", "N/A")
        context_parts.append(
            f"[Source {i} | File: {source} | Page: {page}]\n{doc.page_content}"
        )
    return "\n\n".join(context_parts)


def is_small_talk(text: str) -> bool:
    lowered = text.strip().lower()
    small_talk_items = {
        "hi", "hello", "hey", "hii", "good morning",
        "good afternoon", "good evening", "how are you"
    }
    return lowered in small_talk_items


def answer_question(question: str, file_ids=None, top_k=4):
    if is_small_talk(question):
        return {
            "answer": "Hello! Upload documents and ask me anything from them. I’ll answer based on the uploaded files.",
            "sources": [],
        }

    docs = vector_service.similarity_search(question, k=top_k, file_ids=file_ids)

    if not docs:
        return {
            "answer": "I could not find relevant information in the uploaded files.",
            "sources": [],
        }

    context = build_context(docs)
    llm = get_llm()

    prompt = f"""
You are a document Q&A assistant.

Rules:
1. Answer only from the provided context.
2. Give a clean and direct answer.
3. Do not dump raw chunks unless necessary.
4. If the user asks for a short answer, keep it short.
5. If the answer is not clearly in the context, say:
   "I could not find it in the uploaded files."
6. Do not repeat duplicate information.

Context:
{context}

User Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)

    cleaned_sources = []
    for doc in docs:
        cleaned_sources.append({
            "file_id": doc.metadata.get("file_id"),
            "file_name": doc.metadata.get("file_name"),
            "page": doc.metadata.get("page"),
            "text": doc.page_content[:250],
        })

    return {
        "answer": response.content.strip(),
        "sources": cleaned_sources,
    }


def semantic_search(query: str, file_ids=None, top_k=5):
    docs = vector_service.similarity_search(query, k=top_k, file_ids=file_ids)
    return [
        {
            "file_id": doc.metadata.get("file_id"),
            "file_name": doc.metadata.get("file_name"),
            "page": doc.metadata.get("page"),
            "text": doc.page_content[:250],
        }
        for doc in docs
    ]