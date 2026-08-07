import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client

from document_parser import extract_text


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env"
    )


# ==========================================
# SUPABASE CLIENT
# ==========================================

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Legal Intelligence Copilot API",
    description="Backend API for AI-powered contract analysis",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# UPLOAD DIRECTORY
# ==========================================

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "Legal Intelligence Copilot API is running",
        "status": "online"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# UPLOAD DOCUMENT
# ==========================================

@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    # --------------------------------------
    # Check file extension
    # --------------------------------------

    allowed_extensions = [".pdf", ".docx"]

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )


    # --------------------------------------
    # Generate unique file name
    # --------------------------------------

    file_id = str(uuid.uuid4())

    safe_filename = f"{file_id}{extension}"

    file_path = UPLOAD_DIR / safe_filename


    # --------------------------------------
    # Save uploaded file
    # --------------------------------------

    try:

        contents = await file.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )


    # --------------------------------------
    # Extract text
    # --------------------------------------

    try:

        extracted_text, page_count = extract_text(
            str(file_path)
        )

    except Exception as e:

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Text extraction failed: {str(e)}"
        )


    # --------------------------------------
    # Check extracted content
    # --------------------------------------

    if not extracted_text.strip():

        raise HTTPException(
            status_code=400,
            detail=(
                "No text could be extracted from the document. "
                "If this is a scanned PDF, OCR will be needed."
            )
        )


    # --------------------------------------
    # Insert document into Supabase
    # --------------------------------------

    document_data = {
        "title": file.filename,
        "document_type": extension.replace(".", "").upper(),
        "status": "UPLOADED",
        "version": "1.0",
        "language": "English",
        "page_count": page_count,
        "upload_date": None,
        "summary": None
    }

    try:

        response = (
            supabase
            .table("documents")
            .insert(document_data)
            .execute()
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Database insertion failed: {str(e)}"
        )


    # --------------------------------------
    # Get created document
    # --------------------------------------

    if not response.data:

        raise HTTPException(
            status_code=500,
            detail="Document was not created in Supabase."
        )

    document = response.data[0]


    # --------------------------------------
    # Return response
    # --------------------------------------

    return {
        "success": True,
        "message": "Document uploaded successfully",
        "document_id": document["id"],
        "filename": file.filename,
        "document_type": extension.replace(".", "").upper(),
        "page_count": page_count,
        "text_length": len(extracted_text),
        "extracted_text_preview": extracted_text[:2000]
    }


# ==========================================
# GET ALL DOCUMENTS
# ==========================================

@app.get("/documents")
def get_documents():

    try:

        response = (
            supabase
            .table("documents")
            .select("*")
            .order("upload_date", desc=True)
            .execute()
        )

        return {
            "success": True,
            "documents": response.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch documents: {str(e)}"
        )


# ==========================================
# GET SINGLE DOCUMENT
# ==========================================

@app.get("/documents/{document_id}")
def get_document(document_id: str):

    try:

        response = (
            supabase
            .table("documents")
            .select("*")
            .eq("id", document_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        return {
            "success": True,
            "document": response.data
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch document: {str(e)}"
        )