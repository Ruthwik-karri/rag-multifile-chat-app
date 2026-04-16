import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from langchain_core.documents import Document

from app.config import UPLOAD_DIR, ALLOWED_EXTENSIONS
from app.services.document_load import load_document
from app.services.text_spliter import split_documents
from app.services.vector_store import VectorStoreService
from app.services.file_registry import add_file_record
from app.utils.helpers import generate_file_id, get_extension

router = APIRouter()
vector_service = VectorStoreService()

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    uploaded = []

    for file in files:
        ext = get_extension(file.filename)
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.filename}")

        file_id = generate_file_id()
        saved_name = f"{file_id}_{file.filename}"
        saved_path = os.path.join(UPLOAD_DIR, saved_name)

        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            docs = load_document(saved_path)
            chunks = split_documents(docs)

            final_docs = []
            for idx, chunk in enumerate(chunks):
                metadata = dict(chunk.metadata) if chunk.metadata else {}
                metadata.update({
                    "file_id": file_id,
                    "file_name": file.filename,
                    "chunk_index": idx
                })

                final_docs.append(
                    Document(
                        page_content=chunk.page_content,
                        metadata=metadata
                    )
                )

            vector_service.add_documents(final_docs)
            add_file_record(file_id, file.filename, saved_path)

            uploaded.append({
                "file_id": file_id,
                "file_name": file.filename,
                "chunks": len(final_docs),
                "status": "indexed"
            })

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process {file.filename}: {str(e)}")

    return {"files": uploaded}