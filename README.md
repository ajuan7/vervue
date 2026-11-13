# Vervue

Vervue is a behavioural interview practice app built for students and graduates preparing for job interviews.

Instead of recording video responses, Vervue lets you practise behavioural interview questions through text-based scenarios and receive feedback on your answers.

I'm building Vervue as a personal project while preparing for software engineering graduate roles. The goal is to make behavioural interview preparation more practical by letting users practise, get feedback, and track their improvement over time.

## How It Works

The basic idea is:

1. Choose the type of role you're preparing for
2. Start a behavioural interview
3. Respond to realistic interview questions
4. Get feedback on your response
5. Review your strengths and areas for improvement
6. Practise again and track your progress

Vervue will focus on areas commonly assessed during behavioural interviews, including:

- Communication
- Teamwork
- Problem solving
- Leadership
- Adaptability
- Accountability
- Conflict management
- Initiative

## Features

- Text-based behavioural interview practice
- Role-specific interview questions
- Realistic workplace scenarios (To-do)
- AI-assisted feedback 
- STAR method evaluation
- Response scoring
- Interview history
- Progress tracking
- Timed questions to mimic real interviews

## Future Implementation
- AI follow up questions
- Dashboard summary of progress

## User Feedback

I've had friends test Vervue and I use what they tell me to improve it. Each item links to the issue where it was fixed.

| What testers said | What I changed |
|---|---|
| (Danny Q.) The last question took 10 to 15 seconds to submit and sometimes stalled | Moved grading to the background so submitting is quick 
| (Keven N.) The submit button seemed to do nothing on an empty answer | Added a clear message instead of a hidden browser warning 
| (Andrew N.) Add voice-to-text and improve the questions based on specific role and company you're applying to | N/A

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Google Gemini for grading

## Getting Started

### Requirements

- Node.js
- npm
- Git
