ESSAY_EXTRACTION_PROMPT = """
You are a text extraction assistant. You will receive a raw email thread export.

Your task is to extract the following and return ONLY a valid JSON object with no extra text, no markdown, no code blocks.

1. "original_content": The body of the first email sent by the original sender (ignore headers, timestamps, email addresses, metadata, and any quoted/cited text sections).
2. "analyzed_content": The body of the reply email, which contains the corrected version of the original (ignore headers, timestamps, email addresses, metadata, and any quoted/cited text sections).

Return format:
{
  "original_content": "...",
  "analyzed_content": "..."
}

Email thread to process:
<email_thread>
%s
</email_thread>
"""


def get_prompt_for_essay_extraction(email_thread: str) -> str:
    return ESSAY_EXTRACTION_PROMPT % email_thread
