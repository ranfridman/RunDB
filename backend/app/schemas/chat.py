from typing import Optional
from enum import Enum
from pydantic import BaseModel

class ChatMode(str, Enum):
    graph = "graph"
    analysis = "analysis"

class ChatRequest(BaseModel):
    mode: ChatMode
    prompt: str
    id: Optional[str] = None
    dbConnectionId: Optional[str] = None
