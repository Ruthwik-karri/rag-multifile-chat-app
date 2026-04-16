from fastapi import APIRouter
from app.schema import ChatRequest
from app.services.rag_service import answer_question

router = APIRouter()

@router.post("/chat")
def chat(payload: ChatRequest):
    return answer_question(
        question=payload.question,
        file_ids=payload.file_ids,
        top_k=payload.top_k
    )