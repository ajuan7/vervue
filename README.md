# Vervue

Vervue is a behavioural interview practice app built for students and graduates preparing for job interviews.

Instead of recording video responses, Vervue lets you practise behavioural interview questions through text-based scenarios and receive feedback on your answers.

I'm building Vervue as a personal project while preparing for software engineering graduate roles. The goal is to make behavioural interview preparation more practical by letting users practise, get feedback, and track their improvement over time.

## What I've Learned

- **Database security.** The Supabase key in the browser is public, so I learned to protect data with row level security and tested the policies, not just assumed they worked.
- **Debugging with logs.** I found the slow last submit by reading Supabase logs and measuring where the time went, instead of guessing. Part of it was my database and server being in different regions.
- **Background work.** I moved AI grading out of the request so users aren't kept waiting, and learned what can go wrong when work runs after the response is sent.
- **Not trusting the browser.** The timer is enforced on the server, and answers are limited in the database, because anything in the browser can be changed.
- **Working through issues and PRs.** I use branches, small pull requests and issues linked to fixes, even as a solo developer.

## What I'm Learning Next

- Moving the grading to Google Cloud and comparing it with the current setup
- Writing unit tests and running them automatically with CI
- Load testing to see where the app breaks
- Rate limiting to protect the AI usage costs

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
- Text-to-speech option during session to imitate real interviews
- Dashboard analytics of progress (graphs, question weakness highlights, etc..)
- AI speech for reading questions
- Self camera view


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

### Requirements

- Node.js
- npm
- Git
