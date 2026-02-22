CERF_LEVEL_EXTRACTION_PROMPT = """
You are a language assessment expert. You will receive two versions of the same text: an original written by a language learner, and a corrected version by a native or proficient speaker.

Your task is to analyze the differences between the two versions and estimate the CEFR level of the original text's author based on the types and frequency of errors found.

Consider the following when assessing:
- Grammar mistakes (case endings, verb conjugations, agreement)
- Vocabulary range and appropriateness
- Sentence structure complexity
- Coherence and cohesion
- Spelling and punctuation

The CEFR level must be one of the following values exactly: "A1", "A2", "B1", "B2", "C1", "C2". "C2" represents near-native proficiency, while "A1" indicates a beginner level.

The recommendation should be a specific, actionable piece of advice that the learner can follow to improve their writing and progress to the desired CEFR level: {target_cefr_level}.

Return ONLY a valid JSON object with no extra text, no markdown, no code blocks:

{{
  "cefr_level": "...",
  "confidence": "high | medium | low",
  "reasoning": "...",
  "recommendation": "..."
}}

Texts to analyze:
<original_content>
{original_content}
</original_content>

<analyzed_content>
{analyzed_content}
</analyzed_content>
"""


def get_cerf_level_extraction_prompt(
    original_content: str,
    analyzed_content: str,
    target_cefr_level: str,
) -> str:
    return CERF_LEVEL_EXTRACTION_PROMPT.format(
        original_content=original_content,
        analyzed_content=analyzed_content,
        target_cefr_level=target_cefr_level,
    )
