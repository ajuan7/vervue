# Data Flow

This document describes how data moves through the system during a full interview session in V1.

---

## Overview

The data flow follows a simple sequence:

1. User starts a session  
2. Questions are loaded  
3. User submits responses  
4. Session is completed  
5. AI generates feedback  
6. Summary is displayed  

---

## 1. Session Creation

- User selects a role  
- A new session record is created in `interview_sessions`  
- The session ID is returned to the client  

---

## 2. Question Retrieval

- Client requests questions for the selected role  
- Questions are fetched from `interview_questions`  
- Client displays questions one-by-one  

---

## 3. Response Submission

For each question:

- User submits an answer  
- A new record is created in `responses` containing:
  - session_id  
  - question_id  
  - user_id  
  - response_text  

---

## 4. Session Completion

- Client marks the session as completed  
- The `completed_at` field is updated in `interview_sessions`  

---

## 5. AI Feedback Generation

- System fetches all responses for the session  
- For each response:
  - AI generates strengths, weaknesses, improvement tips, and star score  
  - A new record is inserted into `feedback` linked by `response_id`  

---

## 6. Summary Retrieval

- Client requests the session summary  
- System returns:
  - session details  
  - all responses  
  - feedback attached to each response  

---

## Final Output

The user sees:

- Their answers  
- AI feedback  
- Scores  
- Overall session summary  

