# Quizzio API

FastAPI backend for the Quizzio application. This API handles PDF processing, vector storage, quiz generation, and scoring.

## Overview

The Quizzio API provides a RESTful interface for:
- Uploading and processing PDF documents
- Creating vector embeddings for semantic search
- Generating quiz questions using AI
- Scoring quiz submissions
- Managing user sessions

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **LangChain**: Framework for developing applications powered by language models
- **OpenAI GPT-3.5-turbo**: For question generation and document understanding
- **FAISS (CPU)**: Vector similarity search library
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI

## Project Structure

```
api/
├── app/
│   ├── main.py              # FastAPI application and middleware setup
│   ├── config.py            # Configuration and environment variable handling
│   ├── models/
│   │   └── schemas.py       # Pydantic models for request/response validation
│   ├── routes/
│   │   ├── pdf_routes.py    # PDF upload and document query endpoints
│   │   └── quiz_routes.py   # Quiz generation and scoring endpoints
│   ├── services/
│   │   ├── pdf_service.py   # PDF processing utilities
│   │   ├── rag_service.py   # RAG implementation and session management
│   │   └── quiz_service.py  # Quiz generation and scoring logic
│   ├── store/
│   │   └── memory_store.py  # In-memory vector stores and session data
│   └── utils/
│       └── cleanup.py       # Background task for session cleanup
├── requirements.txt         # Python dependencies
└── run.sh                  # Startup script
```

## Installation

### Prerequisites

- Python 3.8 or higher (recommended: Python 3.13)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Create a virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**:
Create a `.env` file in the `apps/api/` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_ORIGIN=http://localhost:3000
```

**Important**: The API automatically sanitizes the `OPENAI_API_KEY` by removing whitespace, which helps prevent common configuration errors.

## Running the Server

### Using the startup script:
```bash
./run.sh
```

### Manual start:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production mode:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:
- **Interactive API docs (Swagger)**: `http://localhost:8000/docs`
- **Alternative API docs (ReDoc)**: `http://localhost:8000/redoc`

## API Endpoints

### PDF Routes

#### `POST /upload-pdf`
Upload a PDF file and create a session for processing.

**Request**:
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**Response**:
```json
{
  "session_id": "unique-session-id"
}
```

#### `POST /ask`
Ask a question about the uploaded PDF content.

**Request**:
- Content-Type: `application/x-www-form-urlencoded`
- Body:
  - `session_id`: Session ID from upload
  - `query`: Your question

**Response**:
```json
{
  "answer": "Answer based on the PDF content"
}
```

#### `POST /delete-session/{session_id}`
Delete a session and free up resources.

**Response**:
```json
{
  "deleted": true
}
```

#### `GET /data`
Get vector database information (for debugging).

**Response**:
```json
{
  "vector_db": {
    "session_id": [...vectors...]
  },
  "session_data": {
    "session_id": "timestamp"
  }
}
```

### Quiz Routes

#### `POST /api/quiz/mode`
Set the quiz mode for a session.

**Request**:
```json
{
  "session_id": "unique-session-id",
  "mode": "give_quiz" | "create_quiz"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Quiz mode set to give_quiz"
}
```

#### `POST /api/quiz/generate/give`
Generate quiz questions for interactive mode (without answers).

**Request**:
```json
{
  "session_id": "unique-session-id"
}
```

**Response**:
```json
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "question_index": 0
    }
  ]
}
```

#### `POST /api/quiz/generate/create`
Generate complete quiz data for PDF export (includes answers).

**Request**:
```json
{
  "session_id": "unique-session-id"
}
```

**Response**:
```json
{
  "questions": [
    {
      "question_index": 1,
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ],
  "answers": [
    {
      "question_index": 1,
      "question": "What is...?",
      "correct_answer": "Option A",
      "correct_index": 0,
      "explanation": "Explanation text"
    }
  ]
}
```

#### `POST /api/quiz/submit`
Submit quiz answers and get scoring results.

**Request**:
```json
{
  "session_id": "unique-session-id",
  "answers": [0, 1, 2, 0, ...]  // Array of selected option indices
}
```

**Response**:
```json
{
  "total_score": 8,
  "total_questions": 10,
  "results": [
    {
      "question_index": 0,
      "user_answer": 0,
      "correct_answer": 0,
      "is_correct": true
    }
  ],
  "explanations": [
    {
      "question_index": 0,
      "explanation": "Explanation text"
    }
  ]
}
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | No | `http://localhost:3000` |

### Session Management

- Sessions expire after **30 minutes** of inactivity
- Automatic cleanup task runs in the background
- Each session stores:
  - Vector embeddings of the PDF content
  - Generated quiz data
  - Quiz mode preference
  - Session activity timestamp

## How It Works

### PDF Processing Flow

1. **Upload**: PDF file is received and saved temporarily
2. **Extraction**: Text is extracted from PDF using PyPDF2
3. **Chunking**: Text is split into manageable chunks for processing
4. **Embedding**: Chunks are converted to vector embeddings using OpenAI
5. **Storage**: Vectors are stored in FAISS for efficient similarity search
6. **Session**: A unique session ID is returned to the client

### Quiz Generation Flow

1. **Mode Selection**: Client sets quiz mode (give_quiz or create_quiz)
2. **Retrieval**: RAG retrieves relevant document sections using vector search
3. **Generation**: GPT-3.5-turbo generates 10 MCQs based on retrieved content
4. **Validation**: Questions are validated and structured
5. **Response**: Questions are returned (with or without answers based on mode)

### Scoring Flow

1. **Submission**: Client submits selected answers as array of indices
2. **Validation**: Answers are validated against stored quiz data
3. **Scoring**: Each answer is compared with correct answer
4. **Explanation**: Explanations are included for each question
5. **Results**: Comprehensive results are returned with score and feedback

## Dependencies

See `requirements.txt` for complete list. Key dependencies:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `langchain` - LLM orchestration
- `langchain-openai` - OpenAI integration
- `langchain-community` - Community integrations
- `faiss-cpu` - Vector similarity search
- `PyPDF2` - PDF processing
- `pydantic` - Data validation
- `python-dotenv` - Environment variable management

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found (session expired or not found)
- `500`: Internal Server Error

All errors return JSON in the format:
```json
{
  "detail": "Error message"
}
```

## Development

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Style
The project follows PEP 8 style guidelines. Consider using:
- `black` for code formatting
- `flake8` for linting
- `mypy` for type checking

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**:
   - Ensure your API key is set in `.env`
   - Check that there are no extra spaces or newlines
   - The API automatically sanitizes the key, but verify it's correct

2. **CORS Errors**:
   - Verify `FRONTEND_ORIGIN` matches your frontend URL
   - Check that the frontend is making requests to the correct API endpoint

3. **Session Not Found**:
   - Sessions expire after 30 minutes
   - Upload the PDF again to create a new session

4. **Memory Issues**:
   - Large PDFs may consume significant memory
   - The cleanup task automatically removes old sessions
   - Consider adjusting `SESSION_TTL_MINUTES` in `config.py` for production

## Security Considerations

- Never commit `.env` files with API keys
- Use environment variables for sensitive configuration
- CORS is configured to allow only specified origins
- Sessions expire automatically to prevent resource leaks
- File uploads are validated (only PDFs accepted)

## License

This project is open source and available for personal and educational use.