# AI Pipeline

This document explains how the AI evaluation pipeline works in V1.  
The pipeline runs after a user completes an interview session.

---

## Overview

The AI pipeline takes user responses and produces structured feedback.  
It runs in three stages:

1. Collect responses  
2. Generate feedback  
3. Store feedback in the database  

---

## Stage 1: Collect Responses

- The system fetches all responses for the given session ID  
- Each response includes:
  - response_id  
  - question_id  
  - response_text  

---

## Stage 2: Generate Feedback

For each response, the AI generates:

- strengths  
- weaknesses  
- improvement_tips  
- star_score  

The AI uses the question + user answer to produce structured evaluation.

---

## Stage 3: Store Feedback

Each feedback item is saved into the `feedback` table with:

- response_id  
- user_id  
- strengths  
- weaknesses  
- improvement_tips  
- star_score  
- created_at  

---

## Trigger

The pipeline is triggered when:

- The user completes the session  
- The route `/api/feedback/generate` is called  

---

## Output

The pipeline produces:

- One feedback record per response  
- A complete summary available at:
  - `/api/sessions/:session_id/summary`

---

## Notes

- The pipeline is synchronous in V1  
