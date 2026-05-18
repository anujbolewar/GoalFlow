# 🎯 GoalFlow — Performance Goal Setting & Tracking Portal

> From goal creation to appraisal — one platform, zero guesswork.
> Built for the **AtomQuest Hackathon 1.0** | Pitch-Ready, Production-Quality.

GoalFlow is a premium enterprise portal designed to align individual employee goals with corporate thrust areas. It features instant validation rules, manager approval locking, real-time telemetry pipelines, and an AI coaching panel powered by Claude 3.5.

---

## 🚀 Live Pitch Demo Modes

To guarantee a flawless pitch on stage—even when conference Wi-Fi fails—GoalFlow supports **two distinct runtime modes**:

### 🛟 Mode A: Off-Grid "Resilient" Demo Mode (Zero-Config)

This mode intercepts network requests client-side, serving our high-fidelity pre-seeded offline mock databases instantly. **No Docker, no databases, and no internet are required!**

1. **Start the Frontend**:
   ```bash
   cd apps/web
   npm run dev
   ```
2. **Open in Browser**:
   Navigate to [http://localhost:3000/login?demo=true](http://localhost:3000/login?demo=true).
   > [!TIP]
   > The `?demo=true` query parameter arms our transparent network fallback layer (`src/lib/api.ts`), ensuring every UI interaction (creating goals, loading AI suggestions, approving and locking sheets) runs flawlessly at sub-millisecond speeds off-grid.

---

### ⚡ Mode B: Full-Stack Live Demo Mode (Postgres + Redis + Sockets)

This mode runs the complete production-ready microservice stack, routing requests through the FastAPI backend to a PostgreSQL database with real-time WebSocket telemetry.

#### 1. Spin Up Database & Caching Services

Ensure Docker Desktop is active, then launch container services:

```bash
docker compose up -d
```

_This starts PostgreSQL 15, Redis 7, and Adminer (Visual DB Client at [http://localhost:8080](http://localhost:8080))._

#### 2. Bootstrap & Seed the Backend API

Activate the Python virtual environment, install dependencies, run migrations, and inject pristine enterprise seed states:

```bash
cd apps/api
source venv/bin/activate
pip install -r requirements.txt
python seed.py
```

_This generates a 16-user enterprise dataset for "Meridian Technologies Pvt. Ltd." with multiple goal sheets pre-seeded in DRAFT, SUBMITTED, and LOCKED states._

#### 3. Start the Backend server

Launch the Uvicorn webserver:

```bash
uvicorn main:app --reload --port 8000
```

_The FastAPI server starts at [http://localhost:8000](http://localhost:8000) (interactive docs at `/docs`)._

#### 4. Run the Frontend

```bash
cd apps/web
npm run dev
```

Navigate to [http://localhost:3000/login](http://localhost:3000/login) to run with live database data.

---

## 🏆 The 3 Pitch "Wow Moments" Playbook

We have engineered three high-impact visual segments designed to wow hackathon judges in less than 20 seconds each:

### 🔒 Wow Moment 1: The Lock Animation (Sound Synthesized)

- **What it shows**: When a manager approves a goal sheet, the goals visually "lock" and freeze.
- **The Wow factor**: The screen overlay locks with an elegant spring transition. Client-side browser synthesizers play a mechanical **audio click** (oscillating frequencies bypassing default autoplay policy blocks), giving judges tactile feedback.
- **How to present**: Open two browser windows side-by-side (Employee Rahul Verma on the left, Manager Neha Gupta on the right). Click "Approve Goal Sheet" on the manager side and watch the employee's screen lock instantly.

### 📊 Wow Moment 2: Real-time Telemetry Dashboard

- **What it shows**: Instant dashboard analytics updating live.
- **The Wow factor**: In the Admin Dashboard, the _Manager Approved_ counter card triggers a scale-spring pulse with expanding green border ripples the exact millisecond a manager approves a sheet anywhere in the organization.
- **How to present**: Keep the Admin Dashboard open in one screen. When the approval executes, the counter increments live without a page refresh!
- **Presentation Tool**: Use the **Demo Master Reset** button at the admin footer to restore all sheets to pristine seeded states in one click.

### 🔮 Wow Moment 3: AI Goal Coach & Skeleton Shimmers

- **What it shows**: Custom target metric recommendation engine.
- **The Wow factor**: Selecting a company alignment Thrust Area (e.g., _Innovation_ or _Cost Reduction_) triggers a gradient shimmer skeleton loader before rendering tailored SMART recommendations.
- **The Wow factor**: Click "Use this suggestion" to watch the forms, units of measure, descriptions, and weightage budgets **auto-fill instantly** with flawless client-side validation logic.

---

## 🛠️ Monorepo Stack

```
GoalFlow/
├── apps/
│   ├── api/             # FastAPI backend, seed scripts, migrations
│   └── web/             # Next.js 14, React 18, Tailwind CSS, Radix UI
├── docker-compose.yml   # Multi-service container definitions
└── package.json         # Workspace execution manager
```

---

## 📋 Hackathon Validation Rules Enforced

- ⚖️ **Weightage Cap**: Sum of goal weights per employee cycle **must equal exactly 100%** on submission.
- 🏷️ **Individual Threshold**: Minimum weightage per goal is **10%**.
- 📦 **Goal Bounds**: Maximum of **8 goals** per employee per cycle.
- 🎯 **Progress Metrics**: Score formulas dynamically map by Unit of Measure (UoM) types (Numeric, %, Timeline, Zero-based).
