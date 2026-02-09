import httpx

from ..config import settings


async def chat_with_model(prompt: str) -> str:
    """Local dev only — uses Ollama's response format, not compatible with OpenAI/Groq/Mistral APIs."""
    async with httpx.AsyncClient() as client:
        print("Sending prompt to LLM:", prompt)
        response = await client.post(
            settings.llm_chat_url,
            json={
                "model": settings.llm_model,
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
                "options": {"num_thread": settings.llm_num_threads},
            },
            timeout=120.0,
        )
        print("LLM response status code:", response.status_code)
        print("LLM response content:", response.text)
        data = response.json()
        if "message" not in data:
            raise ValueError(f"Unexpected Ollama response: {data}")
        return data["message"]["content"]
