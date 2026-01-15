# Quizzio

![Quizzio Hero](images/hero.png)

**Transform PDFs into Interactive Quizzes**

Quizzio is an AI-powered application that converts PDF documents into comprehensive multiple-choice quizzes. Perfect for educators, students, and professionals who want to test knowledge efficiently.

## Features

- 📄 **PDF Upload**: Upload any PDF document and extract content automatically
- 🤖 **AI-Powered Generation**: Uses advanced RAG (Retrieval-Augmented Generation) to create contextually relevant questions
- 📝 **Two Quiz Modes**:
  - **Interactive Quiz**: Take quizzes online with instant scoring and explanations
  - **Create Quiz**: Generate printable quiz PDFs with answer keys
- ✅ **Instant Feedback**: Get immediate results with detailed explanations for each question
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- 🔄 **Session Management**: Automatic cleanup of inactive sessions

## Tech Stack

### Backend (API)
- **FastAPI**: High-performance Python web framework
- **LangChain**: AI orchestration and RAG implementation
- **OpenAI GPT**: Question generation and content understanding
- **FAISS**: Vector similarity search for document retrieval
- **PyPDF2**: PDF parsing and text extraction

### Frontend (Web)
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client for API communication

## Project Structure

```
quizzio/
├── apps/
│   ├── api/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py      # FastAPI application entry point
│   │   │   ├── config.py    # Configuration and environment variables
│   │   │   ├── models/      # Pydantic schemas
│   │   │   ├── routes/      # API route handlers
│   │   │   ├── services/    # Business logic (RAG, quiz generation)
│   │   │   ├── store/       # In-memory session and vector store
│   │   │   └── utils/       # Utility functions (cleanup tasks)
│   │   ├── requirements.txt # Python dependencies
│   │   └── run.sh          # API startup script
│   │
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── app/         # Next.js App Router pages
│       │   └── components/  # React components
│       ├── public/          # Static assets
│       └── package.json     # Node.js dependencies
│
└── images/                  # Project images and assets
```

## Getting Started

### Prerequisites

- **Python 3.8+** (recommended: Python 3.13)
- **Node.js 18+** (recommended: Node.js 20+)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. Navigate to the API directory:
```bash
cd apps/api
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in `apps/api/`:
```env
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_ORIGIN=http://localhost:3000
```

5. Run the API server:
```bash
./run.sh
# Or manually:
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the web directory:
```bash
cd apps/web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The web application will be available at `http://localhost:3000`

## Usage

1. **Upload a PDF**: Click the upload area and select a PDF file from your device
2. **Choose Quiz Mode**: 
   - **Give Quiz**: Take an interactive quiz with instant scoring
   - **Create Quiz**: Generate a printable quiz PDF
3. **Generate Questions**: The AI will analyze your document and create 10 multiple-choice questions
4. **Take or Export**: 
   - For interactive mode: Answer questions and submit for instant feedback
   - For create mode: Export the quiz as a PDF with an answer key

## API Endpoints

### PDF Routes
- `POST /upload-pdf` - Upload a PDF and create a session
- `POST /ask` - Ask questions about the uploaded PDF
- `POST /delete-session/{session_id}` - Delete a session
- `GET /data` - Get vector database information

### Quiz Routes
- `POST /api/quiz/mode` - Set quiz mode (give_quiz or create_quiz)
- `POST /api/quiz/generate/give` - Generate quiz for interactive mode
- `POST /api/quiz/generate/create` - Generate quiz for PDF export
- `POST /api/quiz/submit` - Submit answers and get scoring results

## Environment Variables

### API (.env)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `FRONTEND_ORIGIN`: Frontend URL for CORS (default: `http://localhost:3000`)

## Development

### Backend Development
- The API uses FastAPI with automatic reload on file changes
- API documentation is available at `http://localhost:8000/docs`
- Interactive API explorer at `http://localhost:8000/redoc`

### Frontend Development
- Hot module replacement is enabled for fast development
- TypeScript provides type safety
- Tailwind CSS for styling with custom utilities

## How It Works

1. **PDF Processing**: When you upload a PDF, the system:
   - Extracts text content using PyPDF2
   - Splits the content into manageable chunks
   - Creates vector embeddings using OpenAI
   - Stores vectors in FAISS for semantic search

2. **Question Generation**: 
   - Uses RAG to retrieve relevant document sections
   - Leverages GPT-3.5-turbo to generate contextually relevant questions
   - Ensures questions test understanding, not just recall

3. **Quiz Modes**:
   - **Interactive Mode**: Questions are sent without answers. After submission, answers are scored server-side
   - **Create Mode**: Full quiz data (including answers) is sent to the frontend for PDF generation

4. **Session Management**:
   - Each PDF upload creates a unique session
   - Sessions expire after 30 minutes of inactivity
   - Automatic cleanup prevents memory leaks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[GitHub Repository](https://github.com/abdulhaseeb2115/quizzio)

## License

This project is open source and available for personal and educational use.