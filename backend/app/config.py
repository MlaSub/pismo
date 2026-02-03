from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    enviroment: str = "development"
    database_host: str = "database"
    database_port: int = 5432

    class Config:
        env_file = ".env.development"


settings = Settings()
