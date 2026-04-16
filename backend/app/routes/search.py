from fastapi import APIRouter
from app.schema import SearchRequest
from app.services.rag_service import semantic_search

router = APIRouter()

@router.post("/search")
def search(payload: SearchRequest):
    results = semantic_search(
        query=payload.query,
        file_ids=payload.file_ids,
        top_k=payload.top_k
    )
    return {"results": results}