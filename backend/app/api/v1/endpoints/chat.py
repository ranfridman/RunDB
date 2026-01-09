from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app import schemas
from app.services.chat_service import chat_service

router = APIRouter()

@router.post("/stream")
async def stream_chat(
    request: schemas.chat.ChatRequest,
):
    """
    Stream a chat response based on mode and prompt.
    """
    return StreamingResponse(
        chat_service.stream_chat_response(mode=request.mode, prompt=request.prompt),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", # Disable buffering for Nginx/proxies
        }
    )
