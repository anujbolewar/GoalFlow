# GoalFlow - Hackathon Demo Guide

This document contains the core credentials and instructions for resetting the environment before a live demo at AtomQuest 1.0.

## 🔑 Demo Credentials

All test users share the same securely hashed password for demo ease: **`Demo@123`**

### 1. Employee Role

**User:** Arjun Mehta (Sales)  
**Email:** `employee@goalflow.demo`  
**What to show:** Live creation of a goal, triggering Claude API for SMART conversion, weightage validation error (110% -> 100%), and submitting for approval.

### 2. Manager Role

**User:** Vikram Nair (Sales Manager)  
**Email:** `manager@goalflow.demo`  
**What to show:** Approving Arjun's goal with an inline edit, triggering the UI Lock state, showing the Audit log. Filling out actuals for a pre-seeded locked goal (Priya).

### 3. Admin / HR Role

**User:** Anita Desai (Admin)  
**Email:** `admin@goalflow.demo`  
**What to show:** The Real-Time Completion Dashboard updating live via WebSockets. Generating the Achievement Report export.

---

## 🔄 Demo Reset Instructions

To restore the exact state described in the pitch deck (where Arjun is ready to submit, Priya is already locked, etc.), run the seed script:

```bash
cd apps/api
source venv/bin/activate
python seed.py
```

This will safely truncate existing data and re-insert the curated demo scenario so you are ready to pitch within seconds.
