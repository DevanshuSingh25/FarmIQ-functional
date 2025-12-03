# FarmIQ Functional Platform

## Project Overview

FarmIQ is an integrated agritech solution that unifies decision support for farmers, vendors, and administrators. The platform combines real‑time advisory services, operational tooling, and AI-driven diagnostics to deliver:

- Multi-role authentication with session-backed profiles (Farmer, Vendor, Admin) and protected client routes.
- Farmer dashboard aggregating weather outlooks, soil analysis, crop history, market benchmarks, NGO schemes, and teaching resources in a responsive UI.
- Vendor and admin consoles for onboarding, scheme management, QR generation, and oversight of IoT deployments.
- IoT module allowing farmers to request sensor installations, view appointment timelines, and monitor live telemetry streams with automatic alerting.
- Market intelligence module surfacing commodity price feeds with filtering, pagination, and saved preferences.
- AI services covering crop disease detection, yield prediction, and soil health evaluations powered by TensorFlow/Keras models served through a Python inference API.
- Accessibility helpers (chatbot widget, text-to-speech mock, multilingual switching via Google Translate) plus error boundaries, toast notifications, and command palette utilities for smoother UX.

### Runtime Architecture

1. **Frontend (Vite + React/TypeScript)**  
   - Runs at `http://localhost:5173` for development.  
   - Uses React Router for navigation, TanStack Query for server cache, Tailwind + shadcn/Radix for UI primitives, and Context-based auth state.  
   - Calls REST APIs via typed service clients in `src/services/*`.

2. **Node.js Backend (Express + SQLite)**  
   - Listens on `http://localhost:3001/api`.  
   - Provides authentication, profile operations, IoT workflows, market data endpoints, and health checks.  
   - Persists to `server/farmiQ.db`, managed through SQL migrations.

3. **Python Inference Service (FastAPI + TensorFlow)**  
   - Runs on `http://localhost:8000`.  
   - Loads `plant_disease_recog_model_pwp.keras` once at startup and exposes `/predict` (multipart image upload) and `/health`.  
   - Integrated with the frontend through `predictionService.ts`.

### Key Modules

- `src/pages/*`: Feature-level screens (FarmIQ dashboard, CropDiseaseDetection, IoTSensor, MarketPrices, SoilAnalysis, YieldPrediction, NGO Schemes, Vendor/Admin dashboards).
- `src/components/*`: Shared UI building blocks, shadcn-derived primitives, IoT widgets, Market tables, Weather cards, chatbots, and protective wrappers (ErrorBoundary, ProtectedRoute).
- `src/services/*`: API clients for auth, IoT, weather, market prices, and ML inference; encapsulate `fetch` with error handling and token/session propagation.
- `server/*`: Express application wiring sessions, CORS, authentication helpers, and database queries; includes migration scripts and health utilities.
- `inference_server.py`: FastAPI router loading TensorFlow model, performing preprocessing (160×160 RGB normalization), and returning class name with confidence.
- `docs/*.md` (AUTH_README, INFERENCE_SERVER_README, deployment-guide, etc.) supply deep dives for specific subsystems.

## Tech Stack

### Frontend

- **React 18** with **TypeScript 5** for typed component architecture.
- **Vite 5** + **@vitejs/plugin-react-swc** for lightning-fast dev server and HMR.
- **Tailwind CSS 3** (with Animate + Typography plugins) plus **shadcn/ui** built on **Radix UI** primitives for consistent styling and accessibility.
- **TanStack React Query 5** for server-state caching; **React Router DOM 6** for routing.
- **React Hook Form 7** + **Zod** for form management and validation.
- **Recharts** for charting, **clsx/tailwind-merge/class-variance-authority** for style composition, **lucide-react** icons, **cmdk**, **vaul**, **sonner**, **react-day-picker**, **embla-carousel**, **resizable-panels**, **next-themes**, **input-otp**, **Radix toast/dialog/menu** suites.
- Custom hooks (`useLanguage`, `use-toast`, `use-mobile`) and utility libs for translations, mock TTS, and prediction helpers.

### Backend (Node.js)

- **Node.js + Express 4** powering REST APIs in `server/server.js`.
- **express-session** for session-backed authentication, **bcryptjs** for hashing, **CORS** middleware, and structured routing inside `auth.js` and related helpers.
- **SQLite3** database accessed through `database.js`; migrations stored under `server/migrations`.
- Development tooling includes **nodemon**, health scripts (`check_backend.js`, PowerShell tests), and environment configuration via `.env`.

### Inference & ML (Python)

- **FastAPI** app serving inference endpoints, hosted with **Uvicorn** (development) or **Gunicorn + Uvicorn workers** (production guidance).
- **TensorFlow 2 / Keras** model `plant_disease_recog_model_pwp.keras` for 38 crop disease classes, with preprocessing handled using **NumPy** and **Pillow**.
- **python-multipart** for file uploads, `logging/os/io` for runtime utilities, and dependency pinning in `requirements.txt`.

### Tooling & DevOps

- **ESLint 9** with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` for linting.
- **Tailwind/PostCSS/Autoprefixer** pipeline for CSS, `tsconfig.*` for type compilation, `components.json` for shadcn scaffolding.
- Package management via **npm** (frontend + backend) and **pip** (Python); alternative **bun.lockb** included.
- Documentation and deployment guides (`deployment-guide.md`, `IMPLEMENTATION_CHECKLIST.md`, `AUTH_README.md`, etc.) ensure consistent onboarding.

## Usage Notes

1. Install dependencies:
   - Frontend: `npm install`
   - Backend: `cd server && npm install`
   - Inference: `python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt`
2. Run services:
   - `npm run dev` (frontend, port 5173)
   - `node server/server.js` (backend, port 3001)
   - `uvicorn inference_server:app --host 0.0.0.0 --port 8000 --reload` (ML API)
3. Configure `.env` with `VITE_API_URL` and `VITE_PREDICTION_API_URL`, matching local ports above.

Use this document as a prompt-ready reference covering both system behavior and the underlying tech stack when briefing collaborators or feeding context to AI assistants.

