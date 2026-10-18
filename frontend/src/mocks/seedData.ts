import {
  ProjectResponse,
  BidResponse,
  ContractResponse,
  MilestoneResponse,
  PaymentResponse,
  UserResponse,
} from '@/types/api';

export const initialUsers: UserResponse[] = [
  {
    id: 1,
    fullName: 'Vikram Malhotra',
    email: 'client@workcraft.io',
    role: 'CLIENT',
    status: 'ACTIVE',
  },
  {
    id: 2,
    fullName: 'Priya Patel',
    email: 'priya@workcraft.io',
    role: 'FREELANCER',
    status: 'ACTIVE',
  },
  {
    id: 3,
    fullName: 'Karthik Sundaram',
    email: 'karthik@workcraft.io',
    role: 'FREELANCER',
    status: 'ACTIVE',
  },
  {
    id: 4,
    fullName: 'Neha Kulkarni',
    email: 'neha@workcraft.io',
    role: 'FREELANCER',
    status: 'ACTIVE',
  },
  {
    id: 5,
    fullName: 'Aman Preet Singh',
    email: 'aman@workcraft.io',
    role: 'FREELANCER',
    status: 'ACTIVE',
  },
  {
    id: 99,
    fullName: 'Admin Control',
    email: 'admin@workcraft.io',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
];

export const initialProjects: ProjectResponse[] = [
  {
    id: 1,
    title: 'Shopify store migration to Next.js storefront',
    description:
      'Migrate our apparel catalog and checkout flow from liquid templates to a Next.js 14 App Router storefront using Shopify Storefront API with sub-second page loads.',
    budget: 84500,
    deadline: '2026-11-20',
    status: 'IN_PROGRESS',
    clientId: 1,
    createdAt: '2026-09-22T09:30:00Z',
    updatedAt: '2026-09-28T14:15:00Z',
  },
  {
    id: 2,
    title: 'Flutter mobile app for clinic appointment booking',
    description:
      'Cross-platform iOS and Android booking app with doctor availability calendars, WhatsApp reminder webhook triggers, and Razorpay patient advance payments.',
    budget: 125000,
    deadline: '2026-12-10',
    status: 'OPEN',
    clientId: 1,
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 3,
    title: 'Razorpay webhook reconciliation worker in Go',
    description:
      'Idempotent webhook processor verifying SHA256 HMAC signatures, storing audit logs in PostgreSQL, and recovering dropped events via daily polling.',
    budget: 48500,
    deadline: '2026-10-04',
    status: 'COMPLETED',
    clientId: 1,
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-10-04T16:00:00Z',
  },
  {
    id: 4,
    title: 'PostgreSQL read-replica indexing & query audit',
    description:
      'Analyze slow query logs on AWS RDS Aurora PostgreSQL, add missing compound indexes on order tracking tables, and eliminate N+1 queries in Spring Data repository.',
    budget: 32000,
    deadline: '2026-11-05',
    status: 'OPEN',
    clientId: 1,
    createdAt: '2026-10-08T11:20:00Z',
    updatedAt: '2026-10-08T11:20:00Z',
  },
  {
    id: 5,
    title: 'GST invoicing PDF generator microservice',
    description:
      'Node.js or Spring Boot microservice to render Indian GST compliant tax invoices with HSN/SAC breakdowns, QR codes, and automated S3 upload.',
    budget: 18500,
    deadline: '2026-10-30',
    status: 'OPEN',
    clientId: 1,
    createdAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-10-10T14:00:00Z',
  },
];

export const initialBids: BidResponse[] = [
  {
    id: 1,
    projectId: 1,
    freelancerId: 2,
    amount: 84500,
    proposal:
      'I have migrated three Shopify Plus brands to Next.js with ISR caching. Will deliver responsive tailwind components and checkout redirect.',
    estimatedDays: 24,
    status: 'ACCEPTED',
    createdAt: '2026-09-24T10:30:00Z',
  },
  {
    id: 2,
    projectId: 1,
    freelancerId: 4,
    amount: 92000,
    proposal:
      'Frontend specialist with extensive headless commerce background. Can deliver full Figma parity and 95+ Google Lighthouse scores.',
    estimatedDays: 28,
    status: 'REJECTED',
    createdAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 3,
    projectId: 2,
    freelancerId: 3,
    amount: 118000,
    proposal:
      'Built a similar telemedicine app on Flutter with Bloc state management and Razorpay gateway integration.',
    estimatedDays: 32,
    status: 'PENDING',
    createdAt: '2026-10-05T14:20:00Z',
  },
  {
    id: 4,
    projectId: 2,
    freelancerId: 2,
    amount: 125000,
    proposal:
      'Can build cross-platform Flutter app alongside backend REST API contracts and push notification workers.',
    estimatedDays: 30,
    status: 'PENDING',
    createdAt: '2026-10-06T09:15:00Z',
  },
  {
    id: 5,
    projectId: 4,
    freelancerId: 5,
    amount: 30000,
    proposal:
      'PostgreSQL DBA with 8 years experience. Will analyze pg_stat_statements and rewrite unoptimized joins.',
    estimatedDays: 7,
    status: 'PENDING',
    createdAt: '2026-10-09T16:00:00Z',
  },
];

export const initialContracts: ContractResponse[] = [
  {
    id: 1,
    projectId: 1,
    bidId: 1,
    clientId: 1,
    freelancerId: 2,
    totalAmount: 84500,
    status: 'ACTIVE',
    startDate: '2026-09-28T14:15:00Z',
    endDate: '2026-11-20T14:15:00Z',
    createdAt: '2026-09-28T14:15:00Z',
  },
  {
    id: 2,
    projectId: 3,
    bidId: 99,
    clientId: 1,
    freelancerId: 5,
    totalAmount: 48500,
    status: 'COMPLETED',
    startDate: '2026-09-12T10:00:00Z',
    endDate: '2026-10-04T16:00:00Z',
    createdAt: '2026-09-12T10:00:00Z',
  },
];

export const initialMilestones: MilestoneResponse[] = [
  {
    id: 1,
    contractId: 1,
    title: 'Storefront schema & Shopify Storefront API setup',
    description: 'GraphQL client configuration, product listing queries, and initial homepage layout.',
    amount: 24500,
    sequenceNumber: 1,
    status: 'PAID',
    submissionDescription: 'Implemented Apollo client and validated catalog queries with test fixtures.',
    deliverableUrl: 'https://github.com/malhotra-retail/nextjs-store/pull/4',
    paidAt: '2026-10-02T11:00:00Z',
    dueDate: '2026-10-02',
    createdAt: '2026-09-28T14:20:00Z',
  },
  {
    id: 2,
    contractId: 1,
    title: 'Cart state, inventory sync & checkout webhook handler',
    description: 'Cart slideover, inventory stock check hooks, and Shopify checkout handoff.',
    amount: 35000,
    sequenceNumber: 2,
    status: 'SUBMITTED',
    submissionDescription: 'Full checkout handoff and cart persistence implemented. Tested across mobile Safari and Chrome.',
    deliverableUrl: 'https://github.com/malhotra-retail/nextjs-store/pull/12',
    dueDate: '2026-10-24',
    createdAt: '2026-09-28T14:20:00Z',
  },
  {
    id: 3,
    contractId: 1,
    title: 'Lighthouse optimization & production cutover',
    description: 'Image optimization with Next/Image, core web vitals tuning, and custom domain deployment.',
    amount: 25000,
    sequenceNumber: 3,
    status: 'IN_PROGRESS',
    dueDate: '2026-11-15',
    createdAt: '2026-09-28T14:20:00Z',
  },
];

export const initialPayments: PaymentResponse[] = [
  {
    id: 1,
    milestoneId: 1,
    contractId: 1,
    clientId: 1,
    freelancerId: 2,
    amount: 24500,
    status: 'COMPLETED',
    paidAt: '2026-10-02T11:00:00Z',
    createdAt: '2026-10-02T11:00:00Z',
  },
];
