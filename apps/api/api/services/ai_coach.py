import os
import json
import requests

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

def get_claude_goal_suggestions(thrust_area: str, employee_role: str, department: str) -> list:
    prompt = f"""You are an HR goal-setting expert. Generate exactly 3 SMART goals for an employee in the {department} department with role {employee_role} under the thrust area '{thrust_area}'.

Return ONLY valid JSON array, no markdown, no explanation:
[
  {{
    "title": "string (max 80 chars)",
    "description": "string (max 200 chars)",
    "uom_type": "numeric" | "percentage" | "timeline" | "zero",
    "suggested_target": number or string,
    "weightage_suggestion": number (10-30),
    "rationale": "string (1 sentence why this goal)"
  }}
]"""

    if ANTHROPIC_API_KEY:
        try:
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            data = {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1000,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.2
            }
            
            res = requests.post(url, json=data, headers=headers, timeout=10)
            if res.status_code == 200:
                content = res.json()["content"][0]["text"].strip()
                # Clean markdown code blocks if Claude mistakenly wrapped it
                if content.startswith("```json"):
                    content = content[7:-3].strip()
                elif content.startswith("```"):
                    content = content[3:-3].strip()
                
                return json.loads(content)
            
            print(f"⚠️ Claude API returned status: {res.status_code}, falling back to mock engine.")
        except Exception as e:
            print(f"⚠️ Claude API connection error: {e}, falling back to mock engine.")

    # High-quality offline fallback templates for bulletproof demo delivery
    print("✨ [AI Coach Fallback Engine] Matching offline HR matrices.")
    
    # Simple semantic mapping
    mock_suggestions = {
        "Revenue Growth": [
            {
                "title": "Acieve INR 50L in new client revenue by Q4",
                "description": "Focus on acquiring mid-market enterprise accounts in Western India.",
                "uom_type": "numeric",
                "suggested_target": 5000000,
                "weightage_suggestion": 25,
                "rationale": "Directly supports organizations focus on top-line expansion."
            },
            {
                "title": "Close 15 enterprise SaaS subscription contracts",
                "description": "Collaborate with Customer Success to upsell premium subscription licenses.",
                "uom_type": "numeric",
                "suggested_target": 15,
                "weightage_suggestion": 20,
                "rationale": "Expands recurring revenue streams and increases average contract value."
            },
            {
                "title": "Boost channel partner referral commissions by 10%",
                "description": "Establish weekly pipeline sync meetings with 10 key regional brokers.",
                "uom_type": "percentage",
                "suggested_target": 10,
                "weightage_suggestion": 15,
                "rationale": "Indirect channel expansion provides scalable sales growth."
            }
        ],
        "Cost Reduction": [
            {
                "title": "Reduce server infrastructure hosting cost by 15%",
                "description": "Deprecate unused EC2/RDS instances and migrate test tools to spot runners.",
                "uom_type": "percentage",
                "suggested_target": 15,
                "weightage_suggestion": 20,
                "rationale": "Directly trims tech operational overheads to maximize EBITDA margins."
            },
            {
                "title": "Complete code migration to save INR 50k monthly tool cost",
                "description": "Transition team from paid commercial runners to open-source CI solutions.",
                "uom_type": "zero",
                "suggested_target": 0,
                "weightage_suggestion": 15,
                "rationale": "Eliminating license duplication immediately reduces monthly SaaS outflows."
            },
            {
                "title": "Optimize cloud storage retention policies",
                "description": "Archive cold logs exceeding 30 days to Glacier deep archive storage.",
                "uom_type": "percentage",
                "suggested_target": 30,
                "weightage_suggestion": 10,
                "rationale": "Automated lifecycle tiering protects cost trends against log growth."
            }
        ],
        "Customer Experience": [
            {
                "title": "Achieve Customer Satisfaction (CSAT) score of 4.5 out of 5",
                "description": "Resolve critical Tier-1 escalation tickets in under 2 hours.",
                "uom_type": "numeric",
                "suggested_target": 4.5,
                "weightage_suggestion": 25,
                "rationale": "Ensures premium customer care standards to maintain retention."
            },
            {
                "title": "Maintain 90% logo retention rate for FY2026",
                "description": "Conduct proactive health checks for top accounts every alternate week.",
                "uom_type": "percentage",
                "suggested_target": 90,
                "weightage_suggestion": 20,
                "rationale": "Protects core revenue from client churn by securing high-risk renewals."
            },
            {
                "title": "Conduct 20 customer workshops",
                "description": "Educate active accounts on advanced configurations to promote feature adoption.",
                "uom_type": "numeric",
                "suggested_target": 20,
                "weightage_suggestion": 15,
                "rationale": "Higher feature adoption is directly correlated with long-term retention."
            }
        ]
    }
    
    # Fallback to revenue growth suggestions if custom key not matching
    return mock_suggestions.get(thrust_area, mock_suggestions["Revenue Growth"])
