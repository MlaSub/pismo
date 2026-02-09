GMAIL_SUBJECT_LINE_INDEX = 1
MIN_LINES_FOR_SUBJECT = 2


def extract_email_subject(text: str) -> str | None:
    """
    Extract the second line from the email export.
    Gmail format: Line 1: sender, Line 2: subject, Line 3: message count
    """
    lines = text.split("\n")

    if len(lines) >= MIN_LINES_FOR_SUBJECT:
        return lines[GMAIL_SUBJECT_LINE_INDEX].strip()

    return None
