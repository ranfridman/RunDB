from typing import Any
from fastapi import APIRouter
from app import schemas
from app.services.db_service import db_service

router = APIRouter()

@router.post("/validate", response_model=bool)
def validate_credentials(
    *,
    request: schemas.db.DBUriRequest,
) -> Any:
    """
    Validate database connection credentials via URI.
    """
    return db_service.validate_credentials(uri=request.uri)

@router.post("/structure", response_model=schemas.db.DBStructureResponse)
def get_structure(
    *,
    request: schemas.db.DBUriRequest,
) -> Any:
    """
    Get the structure of the database.
    """
    return db_service.get_structure(uri=request.uri)
