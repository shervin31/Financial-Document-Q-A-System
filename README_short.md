# Financial Document Q&A System 📄💬

A Retrieval-Augmented Generation (RAG) system that answers questions about financial filings. Currently set up for JPMorgan Chase's 2025 10-K, built with LangChain, FAISS, and GPT-4o-mini, with a minimalist TypeScript chat UI.

## Features

* 🖥️ Minimalist chat UI (React + TypeScript) with chat history and streaming markdown answers
* 📝 Loads the 10-K PDF, splits it into chunks, and embeds them with `all-MiniLM-L6-v2`
* 🤖 FAISS retrieval (top 4 chunks) feeding GPT-4o-mini through a LangChain chain
* ⚡ FastAPI backend that streams responses token by token

## Installation

1. Clone the repository:

```
git clone https://github.com/shervin31/Financial-Document-QA-System.git
cd Financial-Document-QA-System
```

2. Install backend dependencies:

```
pip install langchain-core langchain-openai langchain-huggingface langchain-community langchain-text-splitters faiss-cpu pypdf sentence-transformers python-dotenv fastapi uvicorn
```

3. Install frontend dependencies:

```
cd frontend
npm install
```

4. Add your OpenAI API key to a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

Run each in its own terminal.

```
# Backend
cd engine
uvicorn server:app --port 8000

# Frontend
cd frontend
npm run dev
```

Open http://localhost:5173 and ask a question about the filing.

## Technologies Used

Python, FastAPI, LangChain, FAISS, HuggingFace Embeddings, OpenAI GPT-4o-mini, TypeScript, React, Vite

## About

RAG-powered Q&A system that answers questions about financial filings with context-grounded responses.
