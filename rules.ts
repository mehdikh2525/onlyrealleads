// rules.ts - Central Lead Bouncer Rules Engine
// Each rule exports: { id, desc, weight, testFn }
// Rules return: { triggered: boolean, reason?: string, score?: number }

export interface RuleResult {
  triggered: boolean;
  reason?: string;
  score?: number;
}

export interface Rule {
  id: string;
  description: string;
  weight: number; // 0-100, higher = more suspicious
  testFn: (payload: LeadPayload) => RuleResult;
}

export interface LeadPayload {
  email?: string;
  phone?: string;
  elapsed_seconds?: number;
  honeypot_value?: string;
  mouse_log?: Array<{ x: number; y: number; t: number }>;
  form_data?: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
}

// Rule implementations
export const honeypotRule: Rule = {
  id: 'honeypot',
  description: 'Detects bots that fill hidden honeypot fields',
  weight: 95,
  testFn: (payload) => {
    if (payload.honeypot_value && payload.honeypot_value.trim().length > 0) {
      return {
        triggered: true,
        reason: 'honeypot_filled',
        score: 95
      };
    }
    return { triggered: false };
  }
};

export const timingRule: Rule = {
  id: 'fast_submission',
  description: 'Flags submissions completed too quickly for humans',
  weight: 80,
  testFn: (payload) => {
    if (payload.elapsed_seconds !== undefined && payload.elapsed_seconds < 3) {
      return {
        triggered: true,
        reason: 'submission_too_fast',
        score: Math.max(60, 90 - (payload.elapsed_seconds * 10)) // Scale: <1s=90, 2s=70, 3s=60
      };
    }
    return { triggered: false };
  }
};

export const disposableEmailRule: Rule = {
  id: 'disposable_email',
  description: 'Blocks known disposable/temporary email domains',
  weight: 70,
  testFn: (payload) => {
    if (!payload.email) return { triggered: false };
    
    const domain = payload.email.split('@')[1]?.toLowerCase();
    if (!domain) return { triggered: false };
    
    // Common disposable domains (expandable)
    const disposableDomains = [
      'mailinator.com', 'tempmail.com', '10minutemail.com',
      'guerrillamail.com', 'trashmail.com', 'yopmail.com',
      'fakeinbox.com', 'sharklasers.com', 'maildrop.cc'
    ];
    
    if (disposableDomains.includes(domain)) {
      return {
        triggered: true,
        reason: 'disposable_email_domain',
        score: 70
      };
    }
    return { triggered: false };
  }
};

export const mouseMovementRule: Rule = {
  id: 'mouse_movement',
  description: 'Analyzes mouse movement patterns for bot-like behavior',
  weight: 40,
  testFn: (payload) => {
    if (!payload.mouse_log || payload.mouse_log.length < 5) {
      return {
        triggered: true,
        reason: 'insufficient_mouse_data',
        score: 30
      };
    }
    
    // Calculate total path length
    let totalDistance = 0;
    for (let i = 1; i < payload.mouse_log.length; i++) {
      const prev = payload.mouse_log[i - 1];
      const curr = payload.mouse_log[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Suspiciously straight line (< 10px total movement)
    if (totalDistance < 10) {
      return {
        triggered: true,
        reason: 'linear_mouse_movement',
        score: 50
      };
    }
    
    return { triggered: false };
  }
};

export const invalidEmailRule: Rule = {
  id: 'invalid_email',
  description: 'Basic email format validation',
  weight: 85,
  testFn: (payload) => {
    if (!payload.email) return { triggered: false };
    
    // Simple but effective email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return {
        triggered: true,
        reason: 'malformed_email',
        score: 85
      };
    }
    return { triggered: false };
  }
};

// Export all rules as an array for easy iteration
export const ALL_RULES: Rule[] = [
  honeypotRule,
  timingRule,
  disposableEmailRule,
  mouseMovementRule,
  invalidEmailRule
];

// Main evaluation function
export function evaluateRules(payload: LeadPayload): {
  status: 'passed' | 'blocked' | 'review';
  totalScore: number;
  triggeredRules: Array<{ id: string; reason: string; score: number }>;
  reason?: string;
} {
  const triggeredRules: Array<{ id: string; reason: string; score: number }> = [];
  let totalScore = 0;

  // Run all rules
  for (const rule of ALL_RULES) {
    const result = rule.testFn(payload);
    if (result.triggered) {
      triggeredRules.push({
        id: rule.id,
        reason: result.reason || rule.id,
        score: result.score || rule.weight
      });
      totalScore += (result.score || rule.weight);
    }
  }

  // Decision thresholds
  let status: 'passed' | 'blocked' | 'review';
  let reason: string | undefined;

  if (totalScore >= 80) {
    status = 'blocked';
    reason = triggeredRules[0]?.reason; // Primary reason
  } else if (totalScore >= 40) {
    status = 'review';
    reason = 'multiple_suspicious_signals';
  } else {
    status = 'passed';
  }

  return {
    status,
    totalScore,
    triggeredRules,
    reason
  };
}

// Helper to add new rules dynamically
export function addCustomRule(rule: Rule): void {
  ALL_RULES.push(rule);
}

// Helper to disable a rule by ID
export function disableRule(ruleId: string): boolean {
  const index = ALL_RULES.findIndex(rule => rule.id === ruleId);
  if (index > -1) {
    ALL_RULES.splice(index, 1);
    return true;
  }
  return false;
} 