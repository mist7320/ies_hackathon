from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    content: str


class DocumentOut(DocumentCreate):
    id: int
