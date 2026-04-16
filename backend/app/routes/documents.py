from fastapi import APIRouter
from app.services.file_registry import get_all_files

router = APIRouter()

@router.get("/documents")
def list_documents():
    return {"files": get_all_files()}