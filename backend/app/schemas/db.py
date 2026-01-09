from typing import Optional, List, Literal
from pydantic import BaseModel

class DBCredentials(BaseModel):
    type: Optional[str] = None  # postgres, mssql, mysql, sqlite, etc.
    host: str
    port: int
    user: str
    password: str
    database: str

class DBValidateResponse(BaseModel):
    success: bool
    message: str

class DatabaseTreeNodeData(BaseModel):
    label: str
    value: str
    type: Literal['database', 'table', 'column']
    children: Optional[List['DatabaseTreeNodeData']] = None

DatabaseTreeNodeData.update_forward_refs()

class DBStructureResponse(BaseModel):
    success: bool
    dbName: str
    data: List[DatabaseTreeNodeData] = []
