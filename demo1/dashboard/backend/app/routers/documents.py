from fastapi import APIRouter

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("")
def list_documents():
    return [{"id": 1, "title": "Sample", "content": "Example document"}]
