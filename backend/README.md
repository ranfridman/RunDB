# FastAPI Project

This is a FastAPI project structured with best practices.

## Project Structure

- `app/main.py`: Entry point of the application.
- `app/api/`: Contains API route definitions.
- `app/schemas/`: Pydantic models (DTOs).
- `app/services/`: Business logic.
- `app/core/`: Configuration and core settings.
- `app/models/`: Database models (currently using mock dicts, but ready for ORM).

## Setup

1.  **Create a virtual environment** (optional but recommended):
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```

2.  **Install dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

## Running the Application

You can run the application using `uvicorn` directly or the provided `run.py` script.

**Method 1: Using Uvicorn (Recommended)**
```powershell
uvicorn app.main:app --reload
```

**Method 2: Using Python script**
```powershell
python run.py
```

## API Documentation

Once running, you can access the interactive API documentation at:
http://127.0.0.1:8000/docs
