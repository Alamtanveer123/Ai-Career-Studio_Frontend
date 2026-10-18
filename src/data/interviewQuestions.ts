import { InterviewQuestion } from '../types/interview';

export const SAMPLE_QUESTIONS: InterviewQuestion[] = [
  // Frontend Engineering
  {
    id: 'fe-jr-1',
    role: 'Frontend Engineering',
    difficulty: 'Junior',
    category: 'Technical',
    question: 'Can you explain the differences between useState and useEffect in React, and how dependency arrays work?',
    contextHint: 'Focus on component lifecycle, re-renders, and preventing infinite loops.',
    keyEvaluationCriteria: [
      'Understanding state re-renders and immutability',
      'Knowledge of the useEffect cleanup function',
      'Explanation of empty vs omitted vs populated dependency arrays'
    ]
  },
  {
    id: 'fe-mid-1',
    role: 'Frontend Engineering',
    difficulty: 'Mid-Level',
    category: 'Technical',
    question: 'How does React 18/19 concurrent rendering work, and when would you use useTransition or useDeferredValue over standard debouncing?',
    contextHint: 'Address interruptible rendering, prioritizing urgent user inputs versus heavy background reconciliations.',
    keyEvaluationCriteria: [
      'Mechanism of concurrent fiber reconciliation',
      'Difference between useTransition and useDeferredValue',
      'Practical user experience benefits over setTimeout/debounce'
    ]
  },
  {
    id: 'fe-sr-1',
    role: 'Frontend Engineering',
    difficulty: 'Senior',
    category: 'Technical',
    question: 'How would you architect a large-scale micro-frontend application with shared design tokens, isolated dependency bundles, and robust Core Web Vitals performance?',
    contextHint: 'Discuss Module Federation, state management across boundaries, and asset caching strategies.',
    keyEvaluationCriteria: [
      'Module Federation vs iframe vs web component trade-offs',
      'Asset loading, bundle size splitting, and tree shaking',
      'LCP/INP/CLS performance optimization and monitoring'
    ]
  },

  // Backend Engineering
  {
    id: 'be-jr-1',
    role: 'Backend Engineering',
    difficulty: 'Junior',
    category: 'Technical',
    question: 'Explain what RESTful API design is and the key differences between SQL (relational) and NoSQL databases.',
    contextHint: 'Cover HTTP verbs, status codes, ACID guarantees, and schema flexibility.',
    keyEvaluationCriteria: [
      'Proper usage of GET, POST, PUT, DELETE and HTTP status codes',
      'ACID properties versus eventual consistency',
      'Selecting the appropriate database based on schema relational requirements'
    ]
  },
  {
    id: 'be-mid-1',
    role: 'Backend Engineering',
    difficulty: 'Mid-Level',
    category: 'Technical',
    question: 'How do you design an idempotent payment processing endpoint in a distributed microservices environment?',
    contextHint: 'Think about idempotency keys, Redis distributed locks, atomic database transactions, and race conditions.',
    keyEvaluationCriteria: [
      'Unique idempotency key propagation in headers',
      'Distributed locks (e.g., Redis SETNX) to prevent simultaneous duplicate requests',
      'Transactional integrity and caching response payloads for safe replay'
    ]
  },
  {
    id: 'be-sr-1',
    role: 'Backend Engineering',
    difficulty: 'Senior',
    category: 'Technical',
    question: 'How would you architect an event-driven system capable of processing 100,000 events/second with exactly-once or at-least-once processing guarantees and dead-letter queue handling?',
    contextHint: 'Consider message brokers like Apache Kafka, partitioning strategies, consumer group rebalancing, and replay mechanisms.',
    keyEvaluationCriteria: [
      'Kafka topic partitioning, consumer group scaling, and commit strategies',
      'Outbox pattern or idempotent consumer implementation for deduplication',
      'Backpressure, DLQ routing, retry policies, and observability'
    ]
  },

  // Full Stack Engineering
  {
    id: 'fs-jr-1',
    role: 'Full Stack Engineering',
    difficulty: 'Junior',
    category: 'Technical',
    question: 'How does client-server communication work with JWT authentication, and where should tokens securely be stored?',
    contextHint: 'Discuss authorization headers, HTTP-only cookies vs localStorage, and XSS/CSRF considerations.',
    keyEvaluationCriteria: [
      'Structure of JWT (header, payload, signature)',
      'Security trade-offs of localStorage vs HTTP-only Secure SameSite cookies',
      'Handling token expiration and unauthorized 401 responses'
    ]
  },
  {
    id: 'fs-mid-1',
    role: 'Full Stack Engineering',
    difficulty: 'Mid-Level',
    category: 'Technical',
    question: 'Walk through how you would implement real-time collaborative features (like live updates or notifications) between a Node.js backend and a React client.',
    contextHint: 'Compare WebSockets, Server-Sent Events (SSE), and short/long polling.',
    keyEvaluationCriteria: [
      'Protocol comparison: WebSockets vs SSE vs HTTP polling',
      'Connection lifecycle management, reconnect logic, and heartbeat pings',
      'Handling scale with Redis Pub/Sub across multiple backend instances'
    ]
  },
  {
    id: 'fs-sr-1',
    role: 'Full Stack Engineering',
    difficulty: 'Senior',
    category: 'Technical',
    question: 'Design an end-to-end file upload and processing pipeline for multi-gigabyte video or document assets that minimizes server load and optimizes user perceived speed.',
    contextHint: 'Think about presigned S3 URLs, multipart chunked uploads, asynchronous processing workers, and webhook notifications.',
    keyEvaluationCriteria: [
      'Direct-to-storage presigned multipart upload flow',
      'Resumable chunked uploading protocols (e.g., TUS)',
      'Asynchronous task queues (BullMQ/Celery) with progress reporting via WebSockets/SSE'
    ]
  },

  // Behavioral & HR Questions across levels
  {
    id: 'beh-mid-1',
    role: 'Full Stack Engineering',
    difficulty: 'Mid-Level',
    category: 'Behavioral',
    question: 'Tell me about a time when you encountered a high-severity production outage. How did you diagnose, resolve, and prevent it in the future?',
    contextHint: 'Use the STAR method (Situation, Task, Action, Result) with blameless post-mortem insights.',
    keyEvaluationCriteria: [
      'Calmness under pressure and systematic triage methodology',
      'Clear communication with stakeholders and teammates',
      'Root-cause analysis and systemic prevention (tests, alerts, runbooks)'
    ]
  },
  {
    id: 'hr-sr-1',
    role: 'Frontend Engineering',
    difficulty: 'Senior',
    category: 'HR',
    question: 'How do you handle technical disagreements or architectural debates within your engineering team when there is no clear consensus?',
    contextHint: 'Discuss disagree-and-commit, prototyping/POCs, data-driven decisions, and mentoring.',
    keyEvaluationCriteria: [
      'Active listening and seeking to understand opposing trade-offs',
      'Constructive debate using metrics, RFCs, and rapid prototypes',
      'Alignment on team velocity and disagree-and-commit culture'
    ]
  }
];
