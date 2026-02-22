from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    enviroment: str
    database_host: str
    database_port: int
    llm_provider: str
    llm_chat_url: str
    llm_model: str
    llm_num_threads: int
    groq_api_key: str = ""

    class Config:
        env_file = ".env.development"


settings = Settings()
