import os
import uuid
import json
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

from document_parser import extract_text

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and a Supabase key are missing from .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(
    title="Legal Intelligence Copilot API",
    description="Backend API for AI-powered contract analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
LOCAL_DOCUMENTS_FILE = DATA_DIR / "documents.json"


def load_local_documents():
    if not LOCAL_DOCUMENTS_FILE.exists():
        return []

    try:
        with open(LOCAL_DOCUMENTS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except Exception:
        return []


def save_local_document(document_data):
    documents = load_local_documents()
    documents.insert(0, document_data)

    with open(LOCAL_DOCUMENTS_FILE, "w", encoding="utf-8") as file:
        json.dump(documents, file, indent=2)


def is_missing_documents_table_error(error_message: str) -> bool:
    lowered_message = (error_message or "").lower()
    return "could not find the table 'public.documents'" in lowered_message or "pgrst205" in lowered_message


@app.on_event("startup")
def startup_message():
    print("database connected")


@app.get("/")
def root():
    return {"message": "Legal Intelligence Copilot API is running", "status": "online"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    allowed_extensions = [".pdf", ".docx"]
    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}{extension}"
    file_path = UPLOAD_DIR / safe_filename

    try:
        contents = await file.read()
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        extracted_text, page_count = extract_text(str(file_path))
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail=(
                "No text could be extracted from the document. "
                "If this is a scanned PDF, OCR will be needed."
            ),
        )

    document_data = {
        "title": file.filename,
        "document_type": extension.replace(".", "").upper(),
        "status": "UPLOADED",
        "version": "1.0",
        "language": "English",
        "page_count": page_count,
        "upload_date": None,
        "summary": None,
    }

    try:
        response = supabase.table("documents").insert(document_data).execute()
    except Exception as e:
        if is_missing_documents_table_error(str(e)):
            local_document = {
                "id": str(uuid.uuid4()),
                **document_data,
                "upload_date": None,
            }
            save_local_document(local_document)
            return {
                "success": True,
                "message": "Document uploaded successfully (stored locally until Supabase table is created)",
                "document_id": local_document["id"],
                "filename": file.filename,
                "document_type": extension.replace(".", "").upper(),
                "page_count": page_count,
                "text_length": len(extracted_text),
                "extracted_text_preview": extracted_text[:2000],
            }

        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")

    if not response.data:
        raise HTTPException(status_code=500, detail="Document was not created in Supabase.")

    document = response.data[0]

    return {
        "success": True,
        "message": "Document uploaded successfully",
        "document_id": document["id"],
        "filename": file.filename,
        "document_type": extension.replace(".", "").upper(),
        "page_count": page_count,
        "text_length": len(extracted_text),
        "extracted_text_preview": extracted_text[:2000],
    }


@app.get("/documents")
def get_documents():
    try:
        response = supabase.table("documents").select("*").order("upload_date", desc=True).execute()
        return {"success": True, "documents": response.data}
    except Exception as e:
        if is_missing_documents_table_error(str(e)):
            return {"success": True, "documents": load_local_documents()}

        raise HTTPException(status_code=500, detail=f"Failed to fetch documents: {str(e)}")


@app.get("/documents/{document_id}")
def get_document(document_id: str):
    try:
        response = supabase.table("documents").select("*").eq("id", document_id).single().execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Document not found")

        return {"success": True, "document": response.data}
    except HTTPException:
        raise
    except Exception as e:
        if is_missing_documents_table_error(str(e)):
            matching_document = next((document for document in load_local_documents() if document.get("id") == document_id), None)
            if matching_document:
                return {"success": True, "document": matching_document}

            raise HTTPException(status_code=404, detail="Document not found")

        raise HTTPException(status_code=500, detail=f"Failed to fetch document: {str(e)}")
