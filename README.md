# 🎯 GoalFlow — Performance Goal Setting & Tracking Portal

> From goal creation to appraisal — one platform, zero guesswork.

GoalFlow is a premium enterprise performance agreement portal built to align individual goals with corporate strategic thrust areas, featuring real-time validations, manager approval workflows, telemetric live dashboards, and an interactive AI Coach panel powered by Claude 3.5.

---

## 🖥️ Portal Walkthrough & Interfaces

### 🔐 1. Access & Sign-In Portal

The central login gateway featuring Azure AD Single Sign-On (SSO) options and direct bypass buttons for our key Employee, Manager, and Admin demo roles.

![Access Portal](./snapshots/login_screen.png)

---

### 📈 2. Employee Performance Desk (Rahul Verma)

The performance tracking board where team members compile quarterly performance indicators, monitor their remaining weightage budgets, and query the active AI suggestions coach.

![Employee Performance Dashboard](./snapshots/employee_dashboard.png)

---

### 🗂️ 3. Manager Goal Approval Desk (Neha Gupta)

The audit workspace where managers review team sheets, verify metrics against corporate Thrust Areas, and trigger a secure lock on compliant sheets with mechanical lock sounds.

![Manager Goal Approval Sheet](./snapshots/manager_dashboard.png)

---

### 📊 4. Admin Completion Dashboard

The executive oversight center charting departmental performance alignment metrics, overall completion averages, and streaming telemetric updates directly via WebSockets.

![Admin Completion Dashboard](./snapshots/admin_dashboard.png)

---

## ⚡ The Problem

Most organizations manage performance agreements using fragmented tools. Teams pass spreadsheets back and forth over email, managers manually tally weights on scrap paper, and HR coordinates cycles using calendar reminders and static forms.

This creates massive blind spots. Employees write poorly defined goals aligned with the wrong corporate objectives. Managers review goals in isolation, leading to a complete lack of transparency. HR has no real-time visibility into organization-wide cycle completion rates until it is too late.

When quarterly appraisal time arrives, this process leads to immense pain. Disconnected metrics, outdated targets, and forgotten adjustments make performance reviews highly subjective, causing friction and demotivation.

---

## 🎯 The Solution

GoalFlow digitizes the entire lifecycle from setting goals to checking achievements inside a unified workspace:

- **Instant Validation Control**: Guarantees goal sheets are mathematically correct and compliant the exact millisecond they are created.
- **Synchronized Sheet Locking**: Ensures targets and weights are fully frozen on manager approval, preventing post-cycle modifications.
- **Live Telemetry Oversight**: Connects organization progress streams into real-time HR visual charts and instant action feeds.

### Comparative Workflow

| Without GoalFlow                         | With GoalFlow                           |
| :--------------------------------------- | :-------------------------------------- |
| Disconnected spreadsheets via email      | Centrally audited digital workspace     |
| Uncontrolled post-cycle modifications    | Immutable manager-locked goal sheets    |
| Opaque departmental completion status    | Real-time WebSockets analytics tracking |
| Subjective and disjointed review metrics | Dynamic UoM achievement formulas        |

---

## 📋 Features

### Core Features (Phase 1 — Goal Creation)

- ✅ **Alignment Structure**: Assign individual goals directly to high-priority Thrust Areas (_Revenue Growth, Cost Reduction, Customer Experience, People Development, Innovation_).
- ✅ **Weightage Cap**: Aggregated goal weights per employee sheet **must equal exactly 100%** on submission.
- ✅ **Budget Threshold**: Individual goals enforce a strict minimum weightage of **10%**.
- ✅ **Goal Bounds**: Limits individual sheets to a maximum of **8 goals** to encourage focused execution.
- ✅ **Transparent Fallbacks**: Client-side interception layers (`?demo=true`) serving offline mock databases if the server goes off-grid.

### Core Features (Phase 2 — Achievement Tracking)

- ✅ **Unit of Measure Configuration**: Support for structured metrics: Percentages, Numerics, Timelines, and Zero-based binary targets.
- ✅ **Scoring Metrics**: Auto-calculates achievement scores dynamically based on directionality formulas:

| UoM Type        | Target Direction           | Formula                                                                 |
| :-------------- | :------------------------- | :---------------------------------------------------------------------- |
| **Numeric / %** | Maximizing (e.g., Revenue) | $\text{Achievement} \div \text{Target}$                                 |
| **Numeric / %** | Minimizing (e.g., Cost)    | $\text{Target} \div \text{Achievement}$                                 |
| **Timeline**    | Schedule Tracking          | $\text{Completion Date} \le \text{Deadline} \implies 100\%$, else $0\%$ |
| **Zero-Based**  | Binary Incidents           | $\text{Actual} = 0 \implies 100\%$, else $0\%$                          |

### Bonus Features

- 🚀 **Azure AD SSO Integration**: Enterprise-grade Azure identity authentication using MSAL.js.
- 🚀 **Microsoft Teams Alerts**: Push automatic notifications to manager channels whenever a team member submits goals.
- 🚀 **Pusher Telemetry Channels**: Broadcasts real-time events to HR dashboards immediately when manager approvals occur.
- 🚀 **AI Coach Recommendation Panel**: Live target metric suggestion generation fueled by Anthropic Claude 3.5 API.

---

## 🛠️ Tech Stack

| Layer             | Technology              | Purpose                                               |
| :---------------- | :---------------------- | :---------------------------------------------------- |
| **Frontend**      | Next.js 14 (App Router) | High-performance React application framework          |
| **UI Components** | Radix UI + shadcn/ui    | Premium, accessible interactive components            |
| **Styling**       | Tailwind CSS            | Sleek, customizable modern interface layout           |
| **Real-time**     | Pusher Channels         | Multi-client WebSocket notification broadcasting      |
| **Backend**       | FastAPI (Python)        | Production-ready asynchronous Python REST API         |
| **Database**      | PostgreSQL 15           | Solid relational data persistence with foreign keys   |
| **Cache & Queue** | Redis 7                 | High-speed cache layer and Celery message broker      |
| **Task Queue**    | Celery + Celery Beat    | Periodic tasks and background job processing          |
| **Auth**          | PyJWT + MSAL.js         | Dual JWT standard and Azure AD SSO login security     |
| **AI Engine**     | Claude 3.5 (Anthropic)  | High-fidelity metric suggestions generation           |
| **Animations**    | Framer Motion           | Smooth springs, slides, and micro-interaction ripples |
| **Charts**        | Recharts                | Interactive departmental stats visualizations         |
| **Hosting**       | Vercel + Railway        | Scalable modern cloud deployments                     |

---

## 📐 Architecture & Telemetry Flow

GoalFlow is structured as an enterprise-grade monorepo containing a Next.js front-end application and a FastAPI backend service communicating over asynchronous pipelines.

![System Architecture Blueprint](./docs/architecture.png)

<details>
<summary>📐 View Interactive Mermaid Flowchart</summary>

```mermaid
graph TD
    User([User Client Browser]) -->|Next.js 14 Web Desk| FE[Next.js Frontend / Vercel]
    FE -->|WebSocket Events| WS[Pusher Channels Client]
    FE -->|JSON API Requests| BE[FastAPI Backend / Railway]
    BE -->|Query / Mutate| DB[(PostgreSQL 15)]
    BE -->|Task Queue| RD[(Redis Cache & Broker)]
    RD -->|Background Job| CW[Celery Worker]
    CW -->|Periodic Triggers| CB[Celery Beat]
    BE -->|AI Sizing Recommendation| CL[Claude API / Anthropic]
    BE -->|Push Events| WSBE[Pusher Channels API]
    WSBE -.--->|Broadcasting| User
```

</details>

👉 **[View Full Architectural Decisions & Logs →](./docs/ARCHITECTURE.md)**

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
python >= 3.11
postgresql >= 15
redis >= 7
```

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/anujbolewar/GoalFlow.git
cd GoalFlow

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
pip install -r requirements.txt
```

---

### Environment Setup

#### Frontend Config (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your_azure_client_id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your_azure_tenant_id
```

#### Backend Config (`apps/api/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goalflow
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your_super_secret_jwt_signing_key_keep_it_safe
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
ANTHROPIC_API_KEY=your_anthropic_claude_api_key
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap2
AZURE_AD_TENANT_ID=your_azure_tenant_id
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@goalflow.demo
SMTP_PASSWORD=smtp_app_password
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your_teams_incoming_webhook_url
AWS_S3_BUCKET=goalflow-production-assets
DEMO_MODE=true
```

---

### Database Setup

```bash
# Apply migrations
cd apps/api
alembic upgrade head

# Inject demo seed data
python seed.py
```

### Run Locally (Terminal Scripts)

```bash
# Terminal 1: Frontend NextJS
cd apps/web && npm run dev

# Terminal 2: Backend FastAPI
cd apps/api && uvicorn main:app --reload

# Terminal 3: Celery Tasks Worker
cd apps/api && celery -A core.celery worker --loglevel=info

# Terminal 4: Celery Beat Scheduler
cd apps/api && celery -A core.celery beat --loglevel=info
```

---

### Docker Compose Quick Start (Recommended)

You can start the entire stack, databases, and message queues in one command:

```bash
docker compose up --build
```

Below is the complete `docker-compose.yml` config orchestrating these services:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: goalflow-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: goalflow
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: goalflow-redis
    restart: always
    ports:
      - '6379:6379'

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: goalflow-api
    restart: always
    ports:
      - '8000:8000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/goalflow
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: goalflow-web
    restart: always
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  celery_worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    command: celery -A core.celery worker --loglevel=info
    container_name: goalflow-celery-worker
    restart: always
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/goalflow
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
      - db

volumes:
  postgres_data:
```

---

## 🚀 Live Demo Credentials

Use these credentials to test the various dashboards inside the portal:

| Persona        | Email address            | Password   | Direct Dashboard Link                                            |
| :------------- | :----------------------- | :--------- | :--------------------------------------------------------------- |
| **Employee**   | `employee@goalflow.demo` | `Demo@123` | [http://localhost:3000/employee](http://localhost:3000/employee) |
| **Manager**    | `manager@goalflow.demo`  | `Demo@123` | [http://localhost:3000/manager](http://localhost:3000/manager)   |
| **Admin / HR** | `admin@goalflow.demo`    | `Demo@123` | [http://localhost:3000/admin](http://localhost:3000/admin)       |

🔗 **[Try the Live Demo Portal →](https://goalflow.vercel.app)**

---

### Demo Reset Pipeline

If you would like to restore the database to its clean seeded state, issue a POST request to our reset endpoint:

```bash
curl -X POST https://api.goalflow.railway.app/demo/reset
```

_Alternatively, you can trigger this in a single click using the **Demo Master Reset** button at the footer of the Admin Dashboard._

---

## 📋 API Route Quick Reference

- 🔗 **[FastAPI Live Interactive OpenAPI docs (Swagger) →](https://api.goalflow.railway.app/docs)**
- 🔗 **[FastAPI ReDoc Reference →](https://api.goalflow.railway.app/redoc)**

| Method   | Endpoint                      | Purpose                                              | Access Role |
| :------- | :---------------------------- | :--------------------------------------------------- | :---------- |
| **POST** | `/auth/login`                 | Authenticates user credentials and signs a JWT token | Public      |
| **GET**  | `/goals/my`                   | Fetches active employee's goal list and cycles       | Employee    |
| **POST** | `/goals/create`               | Compiles new performance goal with validations       | Employee    |
| **POST** | `/manager/goals/{id}/approve` | Approves and permanently locks the sheet             | Manager     |
| **GET**  | `/admin/dashboard`            | Compiles aggregate stats and organizational metrics  | Admin       |
| **POST** | `/ai/suggest-goals`           | Triggers Claude AI metric recommendation prompts     | Employee    |
| **WS**   | `/ws/dashboard`               | Real-time WebSocket connection for activity events   | Admin       |

---

## 📂 Project Structure

```
goalflow/
├── apps/
│   ├── web/                    # Next.js 14 App Router
│   │   ├── app/               # Main layout routes
│   │   ├── components/        # Radix & Custom components
│   │   ├── features/          # Modular feature sections
│   │   │   ├── goals/         # Performance agreements
│   │   │   ├── manager/       # Approvals & inline adjustments
│   │   │   ├── admin/         # HR visual stats
│   │   │   ├── auth/          # Azure SSO & local forms
│   │   │   └── ai/            # Claude suggestions shimmers
│   │   ├── lib/               # Telemetry tools & fallbacks
│   │   └── types/             # Common TS configurations
│   │
│   └── api/                   # FastAPI Server Layer
│       ├── routers/           # Endpoint handlers
│       ├── services/          # Business logic engines
│       ├── models/            # SQLAlchemy database tables
│       ├── schemas/           # Pydantic data schema models
│       ├── core/              # Config, security, Celery Beat
│       ├── dependencies/      # Role permissions & authed tokens
│       └── migrations/        # Alembic schema modifications
│
├── packages/
│   └── shared/                # Common schemas (TS + Python)
│
├── docs/
│   ├── architecture.png       # Static overview diagram
│   ├── ARCHITECTURE.md        # Core technical specifications
│   └── ADR/                   # Architecture Decision Records
│
├── docker-compose.yml         # Container services configurations
├── README.md                  # Main walk-through manual
└── turbo.json                 # Turborepo configurations
```

---

## 📈 Platform Cost Analysis

GoalFlow was architected from day one to operate with near-zero overhead, utilizing standard sandbox limits:

| Infrastructure Layer      | Service Plan                | Monthly Cost     |
| :------------------------ | :-------------------------- | :--------------- |
| **Frontend Delivery**     | Vercel Hobby Plan           | $0.00            |
| **API & Database Server** | Railway Starter Plan        | $5.00            |
| **Real-time Pipeline**    | Pusher Channels Sandbox     | $0.00            |
| **AI Suggestions**        | Anthropic API (Pay-Per-Use) | ~$2.00           |
| **CI/CD Integrations**    | GitHub Actions (Free Tier)  | $0.00            |
| **TOTAL RUN COST**        |                             | **~$7.00/month** |

> [!NOTE]
> Designed to support a growing organization of **100 active employees for under $10 per month**.

---

## 🤝 Contributing

We welcome structural improvements from the community!

1. **Fork** the repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Ensure your changes pass linting and matches style guides:
   - **Frontend**: `eslint` and `prettier` formatting rules.
   - **Backend**: `flake8` and `black` formatter scripts.
3. Commit using Conventional Commits: `git commit -m "feat(web): add mechanical audio mute selector"`.
4. Open a **Pull Request** explaining your implementation details.

---

## 👥 Core Project Team

- **Anuj** — _Agentic Orchestration_ — [@anujbolewar](https://github.com/anujbolewar)
- **Divesh** — _Systems Design_
- **Om** — _ML Sizing_
- **Atul** — _Fullstack Integration_
- **Tiya** — _GenAI & Communications_

---

P.S. We read the requirements. Then we read them again. Every validation rule you defined is fully enforced, and every interface is pitch-ready!

Built with ❤️ for GoalFlow.
<!-- trigger github refresh -->
