from typing import Any
from fastapi import APIRouter
from app import schemas
from app.services.db_service import db_service

router = APIRouter()

@router.post("/validate", response_model=bool)
def validate_credentials(
    *,
    credentials: schemas.db.DBCredentials,
) -> Any:
    """
    Validate database connection credentials.
    Tests if the provided credentials can successfully connect to the database.
    """
    return db_service.validate_credentials(credentials=credentials)

@router.post("/structure", response_model=schemas.db.DBStructureResponse)
def get_structure(
    *,
    credentials: schemas.db.DBCredentials,
) -> Any:
    """
    Get the structure of the database.
    Returns all tables, columns, and their data types.
    """
    return db_service.get_structure(credentials=credentials)
