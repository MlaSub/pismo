import httpx
from groq import AsyncGroq

from ..config import settings


async def _chat_ollama(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.llm_chat_url,
            json={
                "model": settings.llm_model,
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
                "options": {"num_thread": settings.llm_num_threads},
            },
            timeout=300.0,
        )
        data = response.json()
        if "message" not in data:
            raise ValueError(f"Unexpected Ollama response: {data}")
        return data["message"]["content"]


async def _chat_groq(prompt: str) -> str:
    client = AsyncGroq(api_key=settings.groq_api_key)
    chat_completion = await client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=settings.llm_model,
    )
    return chat_completion.choices[0].message.content


async def chat_with_model(prompt: str) -> str:
    if settings.llm_provider == "groq":
        return await _chat_groq(prompt)
    return await _chat_ollama(prompt)
