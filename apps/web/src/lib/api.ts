// apps/web/src/lib/api.ts
// Transparent Offline Demo Fallback Network Layer for GoalFlow Hackathon Pitch

export const OFFLINE_DB = {
  me: {
    id: 'u-emp-4',
    name: 'Rahul Verma',
    email: 'rahul.verma@goalflow.demo',
    role: 'EMPLOYEE',
    dept_id: 'dept-eng',
    manager_id: 'u-mgr-eng',
  },

  employeeGoals: [
    {
      id: 'g-mock-1',
      thrustArea: 'Innovation',
      title: 'Migrate legacy auth to Azure AD SSO',
      uom: 'Timeline',
      target: '100% complete',
      weightage: 30,
      status: 'DRAFT',
    },
    {
      id: 'g-mock-2',
      thrustArea: 'Operational Excellence',
      title: 'Implement SonarQube Quality Gates in CI/CD',
      uom: 'Percentage',
      target: '85%',
      weightage: 15,
      status: 'DRAFT',
    },
  ],

  aiSuggestions: {
    'Revenue Growth': [
      {
        title: 'Achieve ₹50L in new client revenue by Q4',
        description:
          'Focus on acquiring mid-market enterprise accounts across Western India.',
        uom_type: 'numeric',
        suggested_target: 5000000,
        weightage_suggestion: 25,
        rationale: 'Aligns with department expansion targets.',
      },
      {
        title: 'Close 15 enterprise SaaS subscription contracts',
        description:
          'Collaborate with Customer Success to upsell premium subscription licenses.',
        uom_type: 'numeric',
        suggested_target: 15,
        weightage_suggestion: 20,
        rationale: 'Expands recurring revenue streams.',
      },
      {
        title: 'Boost channel partner referral commissions by 10%',
        description:
          'Establish weekly pipeline sync meetings with 10 key regional brokers.',
        uom_type: 'percentage',
        suggested_target: 10,
        weightage_suggestion: 15,
        rationale: 'Scales indirect revenue growth channels.',
      },
    ],
    'Cost Reduction': [
      {
        title: 'Reduce server infrastructure hosting cost by 15%',
        description:
          'Deprecate unused EC2/RDS instances and migrate test tools to spot runners.',
        uom_type: 'percentage',
        suggested_target: 15,
        weightage_suggestion: 20,
        rationale: 'Trims operational cloud hosting overheads immediately.',
      },
      {
        title: 'Complete code migration to save ₹50k monthly tool cost',
        description:
          'Transition dev teams from paid commercial runners to self-hosted runners.',
        uom_type: 'zero',
        suggested_target: 0,
        weightage_suggestion: 15,
        rationale: 'Eliminates license duplications across projects.',
      },
      {
        title: 'Optimize cloud storage retention policies',
        description:
          'Archive cold logs exceeding 30 days to Glacier deep archive storage.',
        uom_type: 'percentage',
        suggested_target: 30,
        weightage_suggestion: 10,
        rationale: 'Protects cloud cost curves from log data expansion.',
      },
    ],
    'Customer Experience': [
      {
        title: 'Achieve CSAT score of 4.5 out of 5',
        description:
          'Resolve critical Tier-1 escalation tickets in under 2 hours.',
        uom_type: 'numeric',
        suggested_target: 4.5,
        weightage_suggestion: 25,
        rationale: 'Maintains high brand trust and corporate SLA compliance.',
      },
      {
        title: 'Maintain 90% customer logo retention rate for FY2026',
        description:
          'Conduct proactive health check reviews with premium tier clients.',
        uom_type: 'percentage',
        suggested_target: 90,
        weightage_suggestion: 20,
        rationale: 'Secures high contract renewals and lowers churn metrics.',
      },
      {
        title: 'Conduct 20 customer training workshops',
        description:
          'Educate active accounts on configurations to drive product stickiness.',
        uom_type: 'numeric',
        suggested_target: 20,
        weightage_suggestion: 15,
        rationale:
          'Directly correlated with high customer lifetime value metrics.',
      },
    ],
  },
};

const BASE_URL = 'http://localhost:8000';

export const fetchApi = async (path: string, options: RequestInit = {}) => {
  const isOfflineMode =
    typeof window !== 'undefined' &&
    (window.location.search.includes('demo=true') ||
      window.location.search.includes('offline=true'));

  if (isOfflineMode) {
    console.log(
      `🛟 [Offline Fallback Engine] Intercepting request to: ${path}`
    );
    return getMockResponse(path, options);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return res;
  } catch (error) {
    console.warn(
      `⚠️ Connection to ${BASE_URL} failed. Dropping back to local offline mock layers...`,
      error
    );
    return getMockResponse(path, options);
  }
};

const getMockResponse = async (
  path: string,
  options: RequestInit
): Promise<Response> => {
  // Simulate network delay to make skeleton shimmers visible
  await new Promise((resolve) => setTimeout(resolve, 800));

  let data: Record<string, unknown> = { status: 'success' };

  if (path.includes('/auth/me')) {
    data = OFFLINE_DB.me as unknown as Record<string, unknown>;
  } else if (path.includes('/goals/my')) {
    data = {
      goals: OFFLINE_DB.employeeGoals,
      total_weightage: 45,
      remaining_weightage: 55,
      status: 'DRAFT',
    };
  } else if (path.includes('/ai/suggest-goals')) {
    let thrust = 'Revenue Growth';
    try {
      const parsed = JSON.parse(options.body as string);
      thrust = parsed.thrust_area || 'Revenue Growth';
    } catch {
      // safe fallback
    }
    const suggestions =
      OFFLINE_DB.aiSuggestions[
        thrust as keyof typeof OFFLINE_DB.aiSuggestions
      ] || OFFLINE_DB.aiSuggestions['Revenue Growth'];
    return {
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => suggestions,
      text: async () => JSON.stringify(suggestions),
    } as Response;
  }

  return {
    ok: true,
    status: 200,
    headers: new Headers(),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response;
};
