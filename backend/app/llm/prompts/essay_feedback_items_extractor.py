ESSAY_FEEDBACK_ITEMS_EXTRACTION_INSTRUCTION = """
You are an expert Russian language examiner preparing candidates for the TRKI (Test of Russian as a Foreign Language) writing exam.

Your task:

1. Compare the ORIGINAL_TEXT and CORRECTED_TEXT.
2. Identify every correction that appears in the corrected version.
3. For each correction:
   - Detect what exactly was wrong in the original.
   - Categorize the mistake strictly into ONE of the following categories:

        grammar
        vocabulary
        punctuation
        spelling
        style
        structure
        task_response

Category definitions:

- grammar → morphological or syntactic errors (cases, agreement, verb conjugation, aspect, word order, etc.)
- vocabulary → wrong word choice, collocation errors, lexical misuse
- punctuation → missing or incorrect punctuation marks
- spelling → incorrect spelling of words
- style → inappropriate register, repetition, awkward phrasing, unnatural expression
- structure → paragraph organization, logical flow, cohesion problems
- task_response → failure to follow task instructions, missing required elements, wrong format

4. Extract EVERY corrected mistake individually. Do not group unrelated mistakes together.
5. If one sentence contains multiple distinct mistakes, separate them into multiple feedback items.
6. Do NOT invent mistakes. Only report differences that are clearly corrected.
7. Keep explanations concise but precise.

Output requirements:

- Return ONLY valid JSON.
- Do NOT include explanations outside JSON.
- Do NOT include markdown formatting.
- The JSON must follow EXACTLY this structure:

{{
  "feedback_items": [
    {{
      "category": "grammar",
      "short_mistake_summary": "Incorrect case ending for 'музыка'",
      "comments": "The noun 'музыка' should be in accusative case: 'музыку'."
    }}
  ]
}}

Rules for fields:

- category → must be exactly one of:
  grammar, vocabulary, punctuation, spelling, style, structure, task_response

- short_mistake_summary → short description (1 sentence max)
- comments → optional but recommended; explain clearly what was wrong and why

Texts to analyze:
<original_text>
{original_content}
</original_text>

<analyzed_text>
{analyzed_content}
</analyzed_text>
"""


def get_essay_feedback_items_extraction_prompt(
    original_content: str,
    analyzed_content: str,
) -> str:
    return ESSAY_FEEDBACK_ITEMS_EXTRACTION_INSTRUCTION.format(
        original_content=original_content,
        analyzed_content=analyzed_content,
    )
