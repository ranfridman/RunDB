from typing import Optional
from enum import Enum
from pydantic import BaseModel

class ChatMode(str, Enum):
    graph = "graph"
    analysis = "analysis"

class ChatRequest(BaseModel):
    mode: ChatMode
    query: str
    id: Optional[str] = None
    uri: Optional[str] = None
