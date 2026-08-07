import fitz
from docx import Document
from pathlib import Path


def extract_pdf_text(file_path: str):
    """
    Extract text from a PDF file.

    Returns:
        text: complete extracted text
        page_count: number of pages
    """

    pdf = fitz.open(file_path)

    pages = []

    for page in pdf:
        text = page.get_text()
        pages.append(text)

    full_text = "\n\n".join(pages)

    page_count = len(pdf)

    pdf.close()

    return full_text, page_count


def extract_docx_text(file_path: str):
    """
    Extract text from a DOCX file.
    """

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            paragraphs.append(paragraph.text)

    full_text = "\n\n".join(paragraphs)

    # DOCX doesn't provide a reliable page count this way.
    page_count = None

    return full_text, page_count


def extract_text(file_path: str):
    """
    Automatically select the correct parser
    based on file extension.
    """

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    elif extension == ".docx":
        return extract_docx_text(file_path)

    else:
        raise ValueError(
            "Unsupported file type. Only PDF and DOCX are supported."
        )