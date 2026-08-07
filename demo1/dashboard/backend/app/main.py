from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import documents, upload

app = FastAPI(title="Hackathon Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
