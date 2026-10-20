# SmartCityAI

**A multi-agent civic complaint and resolution platform** that helps citizens report city issues and helps municipal teams triage, route, and resolve them.

## Start locally

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the API. The API starts in an in-memory demo mode without credentials. Copy `backend/.env.example` to `backend/.env` and configure integrations to enable MongoDB Atlas, Gemini, email, and object storage.

### Backend tests

```powershell
cd backend
py -m pip install -r requirements-dev.txt
py -m pytest
```

## Project structure

```text
smartcityai/
├── frontend/                 # React, Vite, Bootstrap, Leaflet, OSM
│   └── src/
│       ├── components/       # Dashboard cards, map, complaint form/table, sidebar
│       ├── pages/             # Role-based screens (expand as the product grows)
│       │   ├── citizen/
│       │   ├── authority/
│       │   └── admin/
│       ├── services/api.js
│       ├── context/
│       ├── App.jsx
│       └── styles.css
├── backend/
│   ├── app/
│   │   ├── agents/           # Specialist AI/triage agents
│   │   ├── api/              # FastAPI routes
│   │   ├── core/             # Configuration, security, database
│   │   ├── graph/            # LangGraph workflows
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── ml/                       # Dataset, training, and model extension points
├── docs/                     # Architecture, API, and test cases
├── docker-compose.yml
└── README.md
```

## Complaint lifecycle

1. Validate citizen text, location, and optional photo (JPEG, PNG, or WebP; maximum 10 MB).
2. Classify photo when vision integration is configured.
3. Resolve location and look for nearby/category/semantic duplicates.
4. Score priority and route by deterministic category-to-department mapping.
5. Hold uncertain recommendations for citizen clarification or human review.
6. Notify the citizen and assigned department when providers are configured.
7. Track officer updates, citizen verification, resolution, or reopening.

## Technology

- **UI:** React, Vite, Bootstrap foundation with a responsive custom design system.
- **Maps:** Leaflet and OpenStreetMap.
- **API:** FastAPI, Pydantic, JWT helper.
- **Orchestration:** LangGraph workflow with modular specialist agents.
- **AI:** Gemini API integration point; optional YOLOv8n research extension.
- **Data:** MongoDB Atlas integration point, in-memory data for local demo, optional vector search.
- **Storage and notifications:** Cloudinary/object storage and SMTP configuration points.
- **Deployment:** Vercel frontend; Render/Railway-compatible FastAPI service; GitHub version control.

## Product brief

### Executive summary

SmartCityAI is a citizen-first, AI-assisted civic operations platform. It turns a photo, location, and short description into a structured, prioritized, traceable municipal service request. Human officers remain responsible for final routing and resolution decisions.

### Problem background and statement

Civic complaints are often scattered across phone calls, social media, and department-specific channels. Citizens lack a clear status trail, while authorities lack a unified view of issues, duplicate reports, and service-level performance. SmartCityAI offers one structured intake and resolution workflow.

### Objectives, scope, and boundaries

- Make it simple to submit a complaint and follow its status.
- Help authorities classify, prioritize, detect duplicates, and route work.
- Provide ward-level operational dashboards and response metrics.
- Prototype city service requests; this is not an emergency dispatch system or an automated authority decision-maker.
- Require human review for low-confidence or consequential AI recommendations.

### Stakeholders and user roles

- **Citizen:** create reports, add evidence, track progress, verify or reopen a resolution.
- **Department officer:** review AI suggestions, assign work, record progress, and submit resolution evidence.
- **City administrator:** manage departments and access, monitor service levels, and audit overrides.
- **Platform administrator:** configure integrations, security, retention, and deployment.

### End-to-end journey

Citizen report → validation → optional vision/location analysis → duplicate check → priority and department suggestion → citizen confirmation / officer review → assignment → work in progress → resolution evidence → citizen verification → closure or reopening.

### Agentic AI architecture

LangGraph holds a bounded complaint workflow. Specialist agents validate, classify images, resolve locations, compare duplicates, propose priority, map categories to departments, plan next actions, and prepare notifications/analytics. Persist complaint state in the application database; do not rely on unlimited conversational memory. Deterministic routing is the source of truth.

### Data and API design

Core documents: `Complaint`, `User`, `Department`, `Assignment`, `StatusEvent`, `Attachment`, `Notification`, and `AIRecommendation`. Store image objects outside MongoDB and retain metadata/URLs only. Optional vector search supports semantic duplicate detection alongside distance and category checks. Initial API routes are documented in [`docs/api/README.md`](docs/api/README.md).

### Security, privacy, and responsible AI

Use JWT authentication and role-based authorization before production. Validate uploads, restrict MIME types/size, use signed object URLs, keep secrets in environment configuration, minimize location/image retention, redact personal data from logs, and protect endpoints with rate limits. Explain AI recommendations; log officer overrides and confidence. A human must be able to correct classifications, priorities, and routing.

### Non-functional requirements and testing

Target a mobile-friendly accessible interface, observable API, bounded inference timeouts, and graceful provider-unavailable operation. Add API/service tests, workflow tests, role/permission tests, upload validation, accessibility checks, and browser E2E tests as the product matures. Starter test cases are in [`docs/test-cases/README.md`](docs/test-cases/README.md).

### Deployment architecture

Deploy the static frontend to Vercel and the FastAPI service to Render/Railway. Use MongoDB Atlas for persistence, an object-storage provider for photos, and managed environment secrets. Configure CORS and health checks per environment; local demo mode does not require credentials.

### Four-month development plan

1. **Month 1:** refine requirements, UI flows, schemas, authentication, citizen intake, and API foundation.
2. **Month 2:** Mongo persistence, uploads, map/location, deterministic routing, and officer queue.
3. **Month 3:** Gemini vision/reasoning, duplicate search, LangGraph workflow, notifications, and audit trail.
4. **Month 4:** analytics, accessibility/security hardening, integration/E2E testing, deployment, and demo rehearsal.

### Team work distribution

- Frontend: citizen, officer, and admin journeys; responsive design; map and accessibility.
- Backend: schemas, auth, APIs, persistence, upload and notification integrations.
- AI/ML: evaluation dataset, vision/duplicate experiments, confidence thresholds, and human-review UX.
- QA/DevOps: test strategy, threat review, CI, deployment, monitoring, and demo operations.

### Risks and mitigation

- **Incorrect AI output:** confidence gates, transparent suggestions, human review, and override metrics.
- **Duplicate false positives:** combine geospatial radius, category, and semantic match; never merge automatically.
- **Sensitive images/location:** consent, minimization, retention controls, access policies, and secure storage.
- **Provider free-tier limits:** quotas/timeouts, caching where appropriate, and manual review fallbacks.
- **Uneven municipal data:** launch with configurable mappings and validate with department stakeholders.

### Evaluation metrics and demo

Measure report completion rate, triage time, routing accuracy, duplicate precision/recall, median resolution time, reopen rate, citizen satisfaction, and AI override rate. Demo: submit a geo-tagged road-damage photo, show classification and a nearby duplicate suggestion, let an officer verify priority/department, update progress, attach resolution evidence, and close after citizen confirmation.

### Future scope

Multilingual and voice intake, offline-first reporting, geospatial hotspot forecasting, fine-tuned YOLOv8n, municipal FAQ RAG, vector search, richer role-based workflows, and integration with official grievance systems.

For the detailed 27-section report covering architecture, AI agents, data design, testing, risks, and the development plan, see [`docs/project-brief.md`](docs/project-brief.md).
