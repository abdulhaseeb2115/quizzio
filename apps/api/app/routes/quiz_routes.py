from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    QuizModeRequest,
    QuizModeResponse,
    QuizGenerateResponse,
    QuizQuestionResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    SessionRequest
)
from ..store.memory_store import vector_stores, session_data, SessionData
from ..services.quiz_service import generate_quiz_questions, score_quiz_answers

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.post("/mode", response_model=QuizModeResponse)
async def set_quiz_mode(request: QuizModeRequest):
    """Set the quiz mode for a session"""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Initialize session data if it doesn't exist
    if request.session_id not in session_data:
        session_data[request.session_id] = SessionData()
    
    # Set the quiz mode
    session_data[request.session_id].quiz_mode = request.mode
    
    return QuizModeResponse(
        success=True,
        message=f"Quiz mode set to {request.mode}"
    )

@router.post("/generate/give", response_model=QuizGenerateResponse)
async def generate_give_quiz(request: SessionRequest):
    """Generate quiz for 'give_quiz' mode - returns questions without answers"""
    session_id = request.session_id
    if session_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check quiz mode
    if session_id not in session_data or session_data[session_id].quiz_mode != "give_quiz":
        raise HTTPException(status_code=400, detail="Quiz mode must be set to 'give_quiz' first")
    
    try:
        # Generate quiz if not already generated
        if session_data[session_id].quiz_data is None:
            quiz_data = generate_quiz_questions(session_id)
            session_data[session_id].quiz_data = quiz_data
        else:
            quiz_data = session_data[session_id].quiz_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
    
    # Return only questions and options (no correct answers)
    questions_response = []
    for i, q in enumerate(quiz_data.questions):
        questions_response.append(QuizQuestionResponse(
            question=q.question,
            options=q.options,
            question_index=i
        ))
    
    return QuizGenerateResponse(questions=questions_response)

@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(request: QuizSubmitRequest):
    """Submit quiz answers and get scoring results"""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Validate quiz mode
    if request.session_id not in session_data or session_data[request.session_id].quiz_mode != "give_quiz":
        raise HTTPException(status_code=400, detail="Quiz mode must be 'give_quiz' to submit answers")
    
    # Validate answers format
    if not request.answers or len(request.answers) == 0:
        raise HTTPException(status_code=400, detail="No answers provided")
    
    try:
        result = score_quiz_answers(request.session_id, request.answers)
        return QuizSubmitResponse(
            total_score=result["total_score"],
            total_questions=result["total_questions"],
            results=result["results"],
            explanations=result["explanations"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to score quiz: {str(e)}")

@router.post("/generate/create")
async def generate_create_quiz(request: SessionRequest):
    """Generate quiz for 'create_quiz' mode - returns full quiz data as JSON for frontend PDF generation"""
    session_id = request.session_id
    if session_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check quiz mode
    if session_id not in session_data or session_data[session_id].quiz_mode != "create_quiz":
        raise HTTPException(status_code=400, detail="Quiz mode must be set to 'create_quiz' first")
    
    try:
        # Generate quiz if not already generated
        if session_data[session_id].quiz_data is None:
            quiz_data = generate_quiz_questions(session_id)
            session_data[session_id].quiz_data = quiz_data
        else:
            quiz_data = session_data[session_id].quiz_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
    
    # Return full quiz data (including answers) as JSON for frontend
    questions_only = []
    answers_only = []
    
    for i, q in enumerate(quiz_data.questions):
        questions_only.append({
            "question_index": i + 1,
            "question": q.question,
            "options": q.options
        })
        answers_only.append({
            "question_index": i + 1,
            "question": q.question,
            "correct_answer": q.options[q.correct_index],
            "correct_index": q.correct_index,
            "explanation": q.explanation
        })
    
    return {
        "questions": questions_only,
        "answers": answers_only
    }
