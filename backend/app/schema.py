from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str
    file_ids: Optional[List[str]] = None
    top_k: int = 5

class ChatRequest(BaseModel):
    question: str
    file_ids: Optional[List[str]] = None
    top_k: int = 4

class DeleteFileRequest(BaseModel):
    file_id: str