import os
import datetime
import requests
import json
try:
    import pusher
except ImportError:
    pusher = None

# Initialize Pusher client dynamically
PUSHER_APP_ID = os.getenv("PUSHER_APP_ID", "123456")
PUSHER_KEY = os.getenv("PUSHER_KEY", "goalflow_pusher_key")
PUSHER_SECRET = os.getenv("PUSHER_SECRET", "goalflow_pusher_secret")
PUSHER_CLUSTER = os.getenv("PUSHER_CLUSTER", "ap2")

pusher_client = None
if pusher is not None:
    try:
        pusher_client = pusher.Pusher(
            app_id=PUSHER_APP_ID,
            key=PUSHER_KEY,
            secret=PUSHER_SECRET,
            cluster=PUSHER_CLUSTER,
            ssl=True
        )
    except Exception as e:
        print(f"Pusher client initialization failed: {e}")

def trigger_pusher_event(event_type: str, employee_name: str, department: str):
    payload = {
        "event_type": event_type, # SUBMIT, APPROVE, CHECKIN, CASCADE
        "employee_name": employee_name,
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "department": department
    }
    
    print(f"📣 [Pusher WebSocket Simulation] Channel: 'dashboard', Event: 'live-update', Payload: {json.dumps(payload)}")
    
    if pusher_client:
        try:
            pusher_client.trigger("dashboard", "live-update", payload)
            print("✅ Real-time WebSocket event published via Pusher!")
        except Exception as e:
            print(f"❌ Failed to publish Pusher event: {e}")

def send_teams_notification(message: str):
    webhook_url = os.getenv("TEAMS_WEBHOOK_URL", "")
    
    payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "6264A7",
        "summary": "GoalFlow System Notification",
        "sections": [{
            "activityTitle": "GoalFlow Notification",
            "activitySubtitle": "AtomQuest Automation Broker",
            "text": message
        }]
    }
    
    print(f"💬 [Microsoft Teams Webhook Mock] Target URL: '{webhook_url or 'NOT_CONFIGURED'}', Payload: {json.dumps(payload)}")
    
    if webhook_url:
        try:
            headers = {"Content-Type": "application/json"}
            res = requests.post(webhook_url, json=payload, headers=headers, timeout=5)
            print(f"✅ Teams webhook dispatched! Status code: {res.status_code}")
        except Exception as e:
            print(f"❌ Failed to dispatch Teams webhook: {e}")
