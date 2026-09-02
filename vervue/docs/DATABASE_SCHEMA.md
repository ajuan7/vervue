# Database Schema

This document describes the actual database structure currently defined in Supabase.  
It is based directly on the live table definitions and foreign key constraints.

---

## 1. Overview
The database stores users, interview sessions, questions, responses, and AI feedback.  
All user accounts come from Supabase Auth.

---

## 2. Tables

### users (Supabase Auth)
Managed automatically by Supabase.

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | uuid      | Primary key                     |
| email      | text      | User email                      |
| created_at | timestamp | Account creation time           |

---

### interview_sessions
Represents a single interview attempt.

| Column        | Type                       | Description                                  |
|---------------|----------------------------|----------------------------------------------|
| id            | uuid                       | Primary key                                  |
| user_id       | uuid                       | User who owns the session                    |
| role          | text                       | Role category for this session               |
| started_at    | timestamp with time zone   | When the session started                     |
| completed_at  | timestamp with time zone   | When the session was completed (nullable)    |

**Foreign Keys:**  
- `user_id` > `auth.users.id`

---

### interview_questions
Stores the question bank.

| Column        | Type      | Description                                  |
|---------------|-----------|----------------------------------------------|
| id            | uuid      | Primary key                                  |
| role          | text      | Role category                                |
| question      | text      | The question text                            |
| difficulty    | text      | Difficulty level (default: 'normal')         |

---

### responses
Stores user answers for each question in a session.

| Column        | Type                       | Description                                  |
|---------------|----------------------------|----------------------------------------------|
| id            | uuid                       | Primary key                                  |
| session_id    | uuid                       | Interview session this response belongs to   |
| question_id   | uuid                       | Question being answered                      |
| user_id       | uuid                       | User who submitted the response              |
| response_text | text                       | User's answer                                |
| created_at    | timestamp with time zone   | When the answer was submitted                |

**Foreign Keys:**  
- `session_id` > `interview_sessions.id`  
- `question_id` > `interview_questions.id`

---

### feedback
Stores AI-generated evaluation for each response.

| Column           | Type                       | Description                                  |
|------------------|----------------------------|----------------------------------------------|
| id               | uuid                       | Primary key                                  |
| response_id      | uuid                       | Response being evaluated                     |
| user_id          | uuid                       | User receiving the feedback                  |
| strengths        | text                       | What the user did well                       |
| weaknesses       | text                       | What needs improvement                       |
| improvement_tips | text                       | Actionable advice for improving the answer   |
| star_score       | integer                    | Numerical score (e.g., 1–5 stars)            |
| created_at       | timestamp with time zone   | When feedback was generated                  |

**Foreign Keys:**  
- `response_id` > `responses.id`

---

## 3. Relationships

- **users > interview_sessions**  
  One user can have many sessions.

- **interview_sessions > responses**  
  A session contains multiple responses.

- **interview_questions > responses**  
  Each response belongs to a specific question.

- **responses > feedback**  
  Each response has one feedback entry.

- **users > responses**  
  Responses store `user_id`, but it is not enforced by a foreign key.

- **users > feedback**  
  Feedback stores `user_id`, but it is not enforced by a foreign key.

