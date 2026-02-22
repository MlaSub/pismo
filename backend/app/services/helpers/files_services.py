import secrets
from pathlib import Path

import pymupdf

PDF_DIR = Path("/app/email_pdfs")


def save_pdf(file: any, user_uuid: str) -> str:
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"{user_uuid}_{secrets.token_hex(8)}.pdf"
    file_path = PDF_DIR / filename

    with file_path.open("wb") as f:
        f.write(file.read())

    return str(file_path)


def remove_file(file_path: str):
    path = Path(file_path)
    if path.exists():
        path.unlink()


def extract_text_from_pdf(file_path: str) -> str:
    doc = pymupdf.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text
