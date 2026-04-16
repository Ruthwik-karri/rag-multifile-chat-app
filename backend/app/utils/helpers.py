import os
import uuid

def generate_file_id():
    return str(uuid.uuid4())

def get_extension(filename: str):
    return os.path.splitext(filename)[1].lower()