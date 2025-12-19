from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import requests
import uvicorn
import json

app = FastAPI()

# Enable CORS for mobile development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "functiongemma:latest"

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    messages: list

class ChatRequest(BaseModel):
    messages: list

@app.get("/")
def health_check():
    return {"status": "online", "model": MODEL_NAME}

@app.post("/chat")
async def chat(payload: ChatRequest):
    # We pass messages directly to Ollama without forcing JSON structure
    messages = payload.messages

    try:
        print(f"Sending request to Ollama ({MODEL_NAME})...")
        res = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "messages": messages,
            "stream": False,
            # "format": "json"  <-- REMOVED to allow free-form text
        })
        res.raise_for_status()
        
        ollama_res = res.json()
        content = ollama_res.get("message", {}).get("content", "")
        
        # Return a simple structure compatible with frontend's basic expectation
        # or just the raw content wrapped in a dict
        return {
            "intent": "chat", # dummy intent to keep frontend happy
            "message": content,
            "data": {}
        }

    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Ollama is not running on port 11434.")
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Host 0.0.0.0 allows access from other devices on the network (e.g. mobile phone/emulator)
    uvicorn.run(app, host="0.0.0.0", port=8000)
