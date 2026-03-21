from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env.development", extra="ignore")

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


settings = Settings()
