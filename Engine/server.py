from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag import JpmRAG

bot = JpmRAG()


@asynccontextmanager
async def lifespan(app: FastAPI):
    bot.initialize()
    bot.create_chatbot()
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/api/health")
def health():
    return {"ready": bot.chain is not None}


@app.post("/api/chat")
def chat(req: ChatRequest):
    def tokens():
        try:
            for chunk in bot.chain.stream(req.question):
                yield chunk
        except Exception as e:
            yield f"\n\n**Error:** {e}"

    return StreamingResponse(tokens(), media_type="text/plain; charset=utf-8")