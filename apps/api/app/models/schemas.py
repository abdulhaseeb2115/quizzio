from pydantic import BaseModel
from typing import Literal, List, Dict, Optional, Any

class UploadResponse(BaseModel):
    session_id: str

class AskResponse(BaseModel):
    answer: str

# Quiz-related schemas
class QuizModeRequest(BaseModel):
    session_id: str
    mode: Literal["give_quiz", "create_quiz"]

class QuizModeResponse(BaseModel):
    success: bool
    message: str

class QuizQuestionResponse(BaseModel):
    question: str
    options: List[str]
    question_index: int

class QuizGenerateResponse(BaseModel):
    questions: List[QuizQuestionResponse]

class QuizSubmitRequest(BaseModel):
    session_id: str
    answers: Dict[str, int]  # question_index (as string) -> selected_option_index

class QuizSubmitResponse(BaseModel):
    total_score: int
    total_questions: int
    results: List[Dict[str, Any]]  # per-question results with correct/incorrect status
    explanations: Optional[List[str]] = None

class SessionRequest(BaseModel):
    session_id: str
