from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from ..store.memory_store import vector_stores, session_data, QuizData, QuizQuestion
import json
from typing import List

def generate_quiz_questions(session_id: str) -> QuizData:
    """Generate exactly 10 MCQs from the document using FAISS retrieval"""
    if session_id not in vector_stores:
        raise ValueError("Session not found")
    
    # Get the retriever for this session
    retriever = vector_stores[session_id].as_retriever(search_kwargs={"k": 15})
    
    # Retrieve relevant chunks - use a general query to get diverse content
    relevant_docs = retriever.invoke("main topics concepts information")
    
    # Combine document chunks into context (limit to avoid token limits)
    context = "\n\n".join([doc.page_content for doc in relevant_docs[:15]])
    
    # Create a strict prompt for MCQ generation
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a quiz generator. Generate exactly 10 multiple-choice questions from the provided document context.

CRITICAL RULES:
1. Output ONLY valid JSON, no markdown, no extra text
2. Exactly 10 questions
3. Exactly 4 options per question
4. correct_index must be 0, 1, 2, or 3
5. Each question must be based on the document content
6. Questions should test understanding, not just recall

Output format (JSON only):
{{
  "questions": [
    {{
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_index": 0,
      "explanation": "string"
    }}
  ]
}}"""),
        ("user", "Document context:\n\n{context}\n\nGenerate 10 MCQs based on this content.")
    ])
    
    # Use GPT-3.5-turbo with temperature 0 for deterministic output
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.0)
    
    # Generate the quiz
    chain = prompt | llm
    response = chain.invoke({"context": context})
    
    # Parse the response - handle both JSON code blocks and plain JSON
    content = response.content.strip()
    
    # Remove markdown code blocks if present
    if content.startswith("```"):
        lines = content.split("\n")
        # Remove first line (```json) and last line (```)
        content = "\n".join(lines[1:-1])
    
    try:
        quiz_json = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response as JSON: {e}\nResponse: {content}")
    
    # Validate structure
    if "questions" not in quiz_json:
        raise ValueError("LLM response missing 'questions' key")
    
    questions_list = quiz_json["questions"]
    
    if len(questions_list) != 10:
        raise ValueError(f"Expected 10 questions, got {len(questions_list)}")
    
    # Validate and convert to QuizQuestion objects
    quiz_questions = []
    for i, q in enumerate(questions_list):
        if "question" not in q or "options" not in q or "correct_index" not in q:
            raise ValueError(f"Question {i} missing required fields")
        
        if len(q["options"]) != 4:
            raise ValueError(f"Question {i} must have exactly 4 options, got {len(q['options'])}")
        
        if q["correct_index"] not in [0, 1, 2, 3]:
            raise ValueError(f"Question {i} correct_index must be 0-3, got {q['correct_index']}")
        
        quiz_questions.append(QuizQuestion(
            question=q["question"],
            options=q["options"],
            correct_index=q["correct_index"],
            explanation=q.get("explanation", "")
        ))
    
    return QuizData(questions=quiz_questions)

def score_quiz_answers(session_id: str, user_answers: dict) -> dict:
    """Score user answers against correct answers"""
    if session_id not in session_data:
        raise ValueError("Session data not found")
    
    quiz_data = session_data[session_id].quiz_data
    if not quiz_data or not quiz_data.questions:
        raise ValueError("Quiz data not found for this session")
    
    questions = quiz_data.questions
    total_questions = len(questions)
    score = 0
    results = []
    explanations = []
    
    for i, question in enumerate(questions):
        user_answer = user_answers.get(str(i))
        correct_index = question.correct_index
        
        is_correct = user_answer == correct_index
        if is_correct:
            score += 1
        
        results.append({
            "question_index": i,
            "user_answer": user_answer,
            "correct_answer": correct_index,
            "is_correct": is_correct,
            "question": question.question
        })
        explanations.append(question.explanation)
    
    # Update quiz data with user answers and score
    quiz_data.user_answers = {int(k): v for k, v in user_answers.items()}
    quiz_data.score = score
    
    return {
        "total_score": score,
        "total_questions": total_questions,
        "results": results,
        "explanations": explanations
    }
