import json
import os
from datetime import datetime
from app.config import REGISTRY_FILE

def _ensure_registry():
    if not os.path.exists(REGISTRY_FILE):
        with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)

def read_registry():
    _ensure_registry()
    with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_registry(data):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def add_file_record(file_id, file_name, file_path):
    records = read_registry()
    records.append({
        "file_id": file_id,
        "file_name": file_name,
        "file_path": file_path,
        "uploaded_at": datetime.utcnow().isoformat()
    })
    write_registry(records)

def delete_file_record(file_id):
    records = read_registry()
    records = [r for r in records if r["file_id"] != file_id]
    write_registry(records)

def get_all_files():
    return read_registry()