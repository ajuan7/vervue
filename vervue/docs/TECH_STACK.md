# Tech Stack

## 1. Frontend
**Next.js (App Router)**  
Used for the main application structure, routing, server actions, and rendering.  
Provides a clean separation between client and server components.

**React**  
Handles interactive UI elements and state within client components.

**TypeScript**  
Adds type safety and helps keep the codebase predictable and easier to maintain.

**CVA (Class Variance Authority)**  
Used to build consistent, reusable UI components with clear styling rules.

## 2. Backend
**Supabase**  
Provides authentication, database storage, row-level security, and simple APIs.  
Acts as the main backend for v1 of the project.

**PostgreSQL (via Supabase)**  
Stores users, sessions, questions, answers, and AI feedback.

## 3. AI Services
**Gemini API**  
Used to evaluate interview answers and generate structured feedback.  
Handles scoring, strengths, weaknesses, and improvement suggestions.

## 4. Deployment & Hosting
**Vercel**  
Hosts the Next.js application.  
Simple deployments and automatic builds.

**Supabase Cloud**  
Hosts the database and authentication services.

## 5. Development Tools
**ESLint & Prettier**  
Ensures consistent formatting and code quality.

**Git & GitHub**  
Version control, branching, and documentation management.

## 6. Future Additions
These are planned for later versions of the project:

- Cloud-hosted AI microservice (AWS Lambda or Google Cloud Run)  
- Queue-based processing for long evaluations  
- Logging and monitoring tools  
- CI/CD pipeline  
- Infrastructure-as-code (Terraform)  
