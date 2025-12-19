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

class AgentResponse(BaseModel):
    intent: str = "chat"
    message: str
    data: Optional[Dict[str, Any]] = {}

@app.get("/")
def health_check():
    return {"status": "online", "model": MODEL_NAME}

@app.post("/chat", response_model=AgentResponse)
async def chat(payload: ChatRequest):
    # 1. Inject schema instructions into the system prompt
    schema_instruction = (
        "You are a helpful AI assistant. You must response in strictly valid JSON format "
        "matching this structure: { 'intent': 'string', 'message': 'string', 'data': {} }. "
        "Use 'intent' to categorize the user's request (e.g., 'greeting', 'question', 'command')."
    )

    messages = payload.messages
    # Ensure system prompt is first
    if messages and messages[0]['role'] != 'system':
        messages.insert(0, {"role": "system", "content": schema_instruction})
    elif messages and messages[0]['role'] == 'system':
        messages[0]['content'] += f" {schema_instruction}"

    try:
        print(f"Sending request to Ollama ({MODEL_NAME})...")
        res = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "messages": messages,
            "stream": False,
            "format": "json" # Force Ollama to output JSON
        })
        res.raise_for_status()
        
        ollama_res = res.json()
        content = ollama_res.get("message", {}).get("content", "{}")
        
        # 2. Parse and Validate with Pydantic
        try:
            # Clean up potential markdown code blocks if the model adds them
            if "```json" in content:
                content = content.replace("```json", "").replace("```", "")
            
            parsed_json = json.loads(content)
            agent_response = AgentResponse(**parsed_json)
            return agent_response
            
        except (json.JSONDecodeError, ValueError) as e:
            # Fallback if model fails strict JSON (rare with FunctionGemma + format='json')
            print(f"JSON Parse Error: {e}. Raw content: {content}")
            return AgentResponse(
                intent="unknown", 
                message=content if content else "Sorry, I couldn't process that correctly.",
                data={"raw_error": str(e)}
            )

    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Ollama is not running on port 11434.")
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Host 0.0.0.0 allows access from other devices on the network (e.g. mobile phone/emulator)
    uvicorn.run(app, host="0.0.0.0", port=8000)
