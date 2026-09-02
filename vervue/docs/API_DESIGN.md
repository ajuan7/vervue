# API Design

This document defines the core API routes used in V1.  
All routes are implemented as server actions.

---

## Sessions

- **POST `/api/sessions/create`**
  - **Purpose:** Create a new interview session  
  - **Input:** role  
  - **Output:** session_id  

- **POST `/api/sessions/:session_id/complete`**
  - **Purpose:** Mark a session as completed  
  - **Effect:** Session marked finished, feedback generation can be triggered  

---

## Questions

- **GET `/api/questions?role=...`**
  - **Purpose:** Fetch all questions for a given role  
  - **Output:** List of questions (id, role, question, difficulty)  

---

## Responses

- **POST `/api/responses/create`**
  - **Purpose:** Store a user’s answer to a question  
  - **Input:** session_id, question_id, user_id, response_text  
  - **Output:** response_id  

---

## Feedback

- **POST `/api/feedback/generate`**
  - **Purpose:** Generate AI feedback for all responses in a session  
  - **Input:** session_id  
  - **Output:** confirmation that feedback was created  

---

## Summary

- **GET `/api/sessions/:session_id/summary`**
  - **Purpose:** Fetch session details, responses, and feedback  
  - **Output:** session object, list of responses, each with attached feedback  
