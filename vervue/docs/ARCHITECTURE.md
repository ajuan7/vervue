# Architecture

## 1. System Overview
The platform is built as a simple, full‑stack web application using Next.js, Supabase, and the Gemini API. Users move through a guided interview flow, their answers are stored, and an AI model evaluates everything once the session is completed. The architecture is intentionally kept lightweight for the first version, with room to expand later.

## 2. Frontend Architecture
The frontend uses the Next.js App Router.

Key parts:
- **Server Actions** for database writes and secure operations  
- **Client Components** for interactive UI elements  
- **Route Groups** to separate interview flow, dashboard, and summary pages  
- **Responsive layout** built with a consistent container system  
- **CVA‑based components** for clean styling and reuse  

The frontend handles:
- displaying questions  
- collecting answers  
- redirecting users through the interview flow  
- showing the final summary page  

## 3. Backend Architecture
Supabase provides authentication and database services.

Backend responsibilities:
- user login and session management  
- storing interview sessions  
- storing answers  
- storing AI feedback  
- enforcing row‑level security  
- preventing access to completed sessions  

Supabase acts as the main backend for v1, keeping things simple and easy to maintain.

## 4. AI Evaluation Pipeline
The AI pipeline runs after a session is completed.

Steps:
1. Collect all user answers  
2. Send them to the Gemini model  
3. Receive structured feedback (scores, strengths, weaknesses, improvements)  
4. Store feedback in Supabase  
5. Redirect the user to the summary page  

The pipeline is currently handled inside a server action, keeping everything in one place.

## 5. Data Flow
A simple end‑to‑end flow:

User > Next.js > Supabase > Gemini API > Supabase > Summary Page

This keeps the system easy to reason about and avoids unnecessary complexity.

## 6. Session Flow
Interview sessions follow a strict order.

Flow:
1. User starts a session  
2. Questions are shown one at a time  
3. Answers are saved immediately  
4. Once the last question is answered, the session is marked as completed  
5. Completed sessions cannot be reopened  
6. AI evaluation runs  
7. Summary page is generated  

This ensures data integrity and a clean user experience.

## 7. Deployment Architecture (v1)
The initial deployment is intentionally simple.

- **Next.js hosted on Vercel**  
- **Supabase hosted on Supabase Cloud**  
- **Gemini API** called directly from server actions  

This setup is easy to maintain and works well for the first version of the project.

## 8. Future Cloud Architecture (v2)
As the project grows, the architecture can expand into a more cloud‑native design.

Potential future improvements:
- **AI microservice** hosted on AWS Lambda or Google Cloud Run  
- **API Gateway / Cloud Functions** for secure AI evaluation endpoints  
- **Cloud logging and monitoring** (CloudWatch, Cloud Logging)  
- **Queue‑based processing** for long or complex evaluations  
- **Separate analytics service** for performance trends  
- **CI/CD pipeline** for automated deployments  

These additions are to make the system more scalable, modular, and production‑ready for real users and not just for solo dev testing.

