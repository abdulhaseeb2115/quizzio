from typing import Dict, Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel

class QuizQuestion(BaseModel):
    question: str
    options: List[str]  # Exactly 4 options
    correct_index: int  # 0-3
    explanation: str

class QuizData(BaseModel):
    questions: List[QuizQuestion]
    user_answers: Optional[Dict[int, int]] = None  # question_index -> selected_option_index
    score: Optional[int] = None

class SessionData(BaseModel):
    quiz_mode: Optional[Literal["give_quiz", "create_quiz"]] = None
    quiz_data: Optional[QuizData] = None

vector_stores: Dict[str, object] = {}
session_activity: Dict[str, datetime] = {}
session_data: Dict[str, SessionData] = {}  # Extended session data for quiz functionality
