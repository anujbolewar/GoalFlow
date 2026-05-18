from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

from api.core.database import engine, Base
from api.routers import (
    auth_router, goals_router, manager_router, 
    checkins_router, admin_router, ai_router
)

# Bind models to database metadata for direct auto-creation on local dev startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GoalFlow API", 
    version="1.0.0",
    description="AtomQuest Hackathon 1.0 Performance Goal Portal API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard routers registrations
app.include_router(auth_router)
app.include_router(goals_router)
app.include_router(manager_router)
app.include_router(checkins_router)
app.include_router(admin_router)
app.include_router(ai_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "GoalFlow API is running"}

@app.post("/demo/reset")
def demo_reset_endpoint():
    from seed import reset_and_seed_db
    from fastapi import HTTPException
    try:
        reset_and_seed_db()
        return {"status": "success", "message": "Database successfully restored to seed data in under 1 second!"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database re-seeding engine failure: {e}"
        )


# WEBSOCKET REAL-TIME LEDGER MANAGEMENT
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🔌 WebSocket connection accepted! Active listeners: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"🔌 WebSocket disconnected! Active listeners: {len(self.active_connections)}")

    async def broadcast_event(self, event_type: str, employee_name: str, department: str):
        import datetime
        payload = {
            "event_type": event_type, # SUBMIT, APPROVE, CHECKIN, CASCADE
            "employee_name": employee_name,
            "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "department": department
        }
        message = json.dumps(payload)
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Stale connection clean up
                pass

ws_manager = ConnectionManager()

# WebSocket Broadcast Route hook
@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open and accept mock messages
            data = await websocket.receive_text()
            # If anyone sends a manual push, broadcast it to all
            try:
                msg_json = json.loads(data)
                await ws_manager.broadcast_event(
                    event_type=msg_json.get("event_type", "LIVE"),
                    employee_name=msg_json.get("employee_name", "Anonymous"),
                    department=msg_json.get("department", "Sales")
                )
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
