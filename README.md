# Pismo

Monorepo with a Python/FastAPI backend and a React Native (Expo) mobile app.

## Prerequisites (macOS)

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Ollama](https://ollama.com/) installed natively on your machine
- [Node.js](https://nodejs.org/) (for the mobile app)
- [Xcode](https://developer.apple.com/xcode/) (for iOS simulator)

## Getting Started (macOS)

### 1. Backend + Database

Start the database and backend with Docker:

```bash
docker compose up
```

### 2. Ollama (LLM)

Ollama runs natively on the host machine rather than in Docker. Running it natively is significantly faster because it can use the GPU directly — dockerising it adds overhead and makes the model much slower (CPU-only on macOS).

In production, a hosted API service (e.g. Mistral, Qwen via Groq, or similar) would be used instead.

Install and start Ollama:

```bash
brew install ollama
ollama serve
```

Pull the required model:

```bash
ollama pull qwen3:1.7b
```

### 3. Mobile App

From the `mobile/` directory:

```bash
npm install
npx expo start
```

Press `i` to open in the iOS simulator (requires Xcode and the iOS simulator to be installed).
