import { http, HttpResponse } from 'msw';
import {
  initialUsers,
  initialProjects,
  initialBids,
  initialContracts,
  initialMilestones,
  initialPayments,
} from './seedData';
import {
  ProjectResponse,
  BidResponse,
  ContractResponse,
  MilestoneResponse,
  PaymentResponse,
  UserResponse,
} from '@/types/api';

// In-memory state for mock sessions
let users = [...initialUsers];
let projects = [...initialProjects];
let bids = [...initialBids];
let contracts = [...initialContracts];
let milestones = [...initialMilestones];
let payments = [...initialPayments];

// Helper to generate a valid base64url encoded mock JWT
function createMockJwt(userId: number, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: String(userId),
      role,
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = btoa('mock-jwt-signature-workcraft-sec');
  return `${header}.${payload}.${signature}`;
}

export const handlers = [
  // ==========================================
  // AUTH & USERS
  // ==========================================
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find((u) => u.email.toLowerCase() === body.email?.toLowerCase());

    if (!user) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 401,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    const token = createMockJwt(user.id, user.role);
    return HttpResponse.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  }),

  http.post('*/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: string;
    };

    const exists = users.find((u) => u.email.toLowerCase() === body.email?.toLowerCase());
    if (exists) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'Bad Request',
          message: 'A user with this email already exists',
        },
        { status: 400 }
      );
    }

    const newUser: UserResponse = {
      id: users.length + 10,
      fullName: `${body.firstName} ${body.lastName}`.trim(),
      email: body.email,
      role: (body.role as any) || 'FREELANCER',
      status: 'ACTIVE',
    };
    users.push(newUser);

    const token = createMockJwt(newUser.id, newUser.role);
    return HttpResponse.json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  }),

  http.get('*/users/freelancers', () => {
    const freelancers = users.filter((u) => u.role === 'FREELANCER');
    return HttpResponse.json(freelancers);
  }),

  http.get('*/users/:id', ({ params }) => {
    const id = Number(params.id);
    const user = users.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'User not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(user);
  }),

  http.put('*/users/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<UserResponse>;
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'User not found' },
        { status: 404 }
      );
    }
    users[index] = { ...users[index], ...body };
    return HttpResponse.json(users[index]);
  }),

  // ==========================================
  // PROJECTS
  // ==========================================
  http.get('*/projects', ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const sizeParam = url.searchParams.get('size');

    if (pageParam !== null || sizeParam !== null) {
      const page = Number(pageParam) || 0;
      const size = Number(sizeParam) || 10;
      const start = page * size;
      const content = projects.slice(start, start + size);
      return HttpResponse.json({
        content,
        totalElements: projects.length,
        totalPages: Math.ceil(projects.length / size),
        size,
        number: page,
        first: page === 0,
        last: start + size >= projects.length,
        empty: content.length === 0,
      });
    }

    return HttpResponse.json(projects);
  }),

  http.get('*/projects/:id', ({ params }) => {
    const id = Number(params.id);
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Project not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(project);
  }),

  http.post('*/projects', async ({ request }) => {
    const body = (await request.json()) as any;
    const newProject: ProjectResponse = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      budget: Number(body.budget) || 50000,
      deadline: body.deadline,
      status: 'OPEN',
      clientId: 1, // Default to current authenticated client
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.unshift(newProject);
    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.put('*/projects/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as any;
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Project not found' },
        { status: 404 }
      );
    }
    projects[index] = {
      ...projects[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(projects[index]);
  }),

  http.delete('*/projects/:id', ({ params }) => {
    const id = Number(params.id);
    projects = projects.filter((p) => p.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('*/projects/:id/status', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { status: any };
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Project not found' },
        { status: 404 }
      );
    }
    projects[index].status = body.status;
    return HttpResponse.json(projects[index]);
  }),

  // ==========================================
  // BIDS
  // ==========================================
  http.get('*/bids/project/:projectId', ({ params }) => {
    const projectId = Number(params.projectId);
    const result = bids.filter((b) => b.projectId === projectId);
    return HttpResponse.json(result);
  }),

  http.get('*/bids/freelancer/:freelancerId', ({ params }) => {
    const freelancerId = Number(params.freelancerId);
    const result = bids.filter((b) => b.freelancerId === freelancerId);
    return HttpResponse.json(result);
  }),

  http.get('*/bids/:id', ({ params }) => {
    const id = Number(params.id);
    const bid = bids.find((b) => b.id === id);
    if (!bid) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Bid not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(bid);
  }),

  http.post('*/bids', async ({ request }) => {
    const body = (await request.json()) as any;
    const newBid: BidResponse = {
      id: Date.now(),
      projectId: Number(body.projectId),
      freelancerId: 2, // Default mock freelancer
      amount: Number(body.amount),
      proposal: body.proposal,
      estimatedDays: Number(body.estimatedDays),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    bids.unshift(newBid);
    return HttpResponse.json(newBid, { status: 201 });
  }),

  http.put('*/bids/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as any;
    const index = bids.findIndex((b) => b.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Bid not found' },
        { status: 404 }
      );
    }
    bids[index] = { ...bids[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(bids[index]);
  }),

  http.delete('*/bids/:id', ({ params }) => {
    const id = Number(params.id);
    bids = bids.filter((b) => b.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('*/bids/:id/accept', ({ params }) => {
    const id = Number(params.id);
    const bid = bids.find((b) => b.id === id);
    if (!bid) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Bid not found' },
        { status: 404 }
      );
    }

    // Accept bid
    bid.status = 'ACCEPTED';

    // Move project to IN_PROGRESS
    const project = projects.find((p) => p.id === bid.projectId);
    if (project) {
      project.status = 'IN_PROGRESS';
    }

    // Auto-create contract
    const newContract: ContractResponse = {
      id: Date.now(),
      projectId: bid.projectId,
      bidId: bid.id,
      clientId: project ? project.clientId : 1,
      freelancerId: bid.freelancerId,
      totalAmount: bid.amount,
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + bid.estimatedDays * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    contracts.unshift(newContract);

    // Seed default first milestone for contract
    milestones.push({
      id: Date.now() + 1,
      contractId: newContract.id,
      title: 'Milestone 1: Project Kickoff & Setup',
      description: 'Initial architectural setup, repository access, and baseline milestones definition.',
      amount: Math.round(bid.amount * 0.4),
      sequenceNumber: 1,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json(bid);
  }),

  http.patch('*/bids/:id/reject', ({ params }) => {
    const id = Number(params.id);
    const bid = bids.find((b) => b.id === id);
    if (!bid) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Bid not found' },
        { status: 404 }
      );
    }
    bid.status = 'REJECTED';
    return HttpResponse.json(bid);
  }),

  // ==========================================
  // CONTRACTS
  // ==========================================
  http.get('*/contracts/:id', ({ params }) => {
    const id = Number(params.id);
    const contract = contracts.find((c) => c.id === id);
    if (!contract) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Contract not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(contract);
  }),

  http.get('*/contracts/client/:clientId', ({ params }) => {
    const clientId = Number(params.clientId);
    const result = contracts.filter((c) => c.clientId === clientId);
    return HttpResponse.json(result);
  }),

  http.get('*/contracts/freelancer/:freelancerId', ({ params }) => {
    const freelancerId = Number(params.freelancerId);
    const result = contracts.filter((c) => c.freelancerId === freelancerId);
    return HttpResponse.json(result);
  }),

  http.patch('*/contracts/:id/complete', ({ params }) => {
    const id = Number(params.id);
    const contract = contracts.find((c) => c.id === id);
    if (!contract) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Contract not found' },
        { status: 404 }
      );
    }
    contract.status = 'COMPLETED';
    return HttpResponse.json(contract);
  }),

  http.patch('*/contracts/:id/cancel', ({ params }) => {
    const id = Number(params.id);
    const contract = contracts.find((c) => c.id === id);
    if (!contract) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Contract not found' },
        { status: 404 }
      );
    }
    contract.status = 'CANCELLED';
    return HttpResponse.json(contract);
  }),

  // ==========================================
  // MILESTONES
  // ==========================================
  http.get('*/milestones/contract/:contractId', ({ params }) => {
    const contractId = Number(params.contractId);
    const result = milestones
      .filter((m) => m.contractId === contractId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    return HttpResponse.json(result);
  }),

  http.get('*/milestones/:id', ({ params }) => {
    const id = Number(params.id);
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(milestone);
  }),

  http.post('*/milestones', async ({ request }) => {
    const body = (await request.json()) as any;
    const newMilestone: MilestoneResponse = {
      id: Date.now(),
      contractId: Number(body.contractId),
      title: body.title,
      description: body.description || '',
      amount: Number(body.amount),
      sequenceNumber: Number(body.sequenceNumber) || milestones.length + 1,
      status: 'PENDING',
      dueDate: body.dueDate || null,
      createdAt: new Date().toISOString(),
    };
    milestones.push(newMilestone);
    return HttpResponse.json(newMilestone, { status: 201 });
  }),

  http.put('*/milestones/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as any;
    const index = milestones.findIndex((m) => m.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }
    milestones[index] = { ...milestones[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(milestones[index]);
  }),

  http.patch('*/milestones/:id/start', ({ params }) => {
    const id = Number(params.id);
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }
    milestone.status = 'IN_PROGRESS';
    return HttpResponse.json(milestone);
  }),

  http.post('*/milestones/:id/submit', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { description: string; deliverableUrl: string };
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }
    milestone.status = 'SUBMITTED';
    milestone.submissionDescription = body.description;
    milestone.deliverableUrl = body.deliverableUrl;
    milestone.rejectionReason = null;
    return HttpResponse.json(milestone);
  }),

  http.patch('*/milestones/:id/approve', ({ params }) => {
    const id = Number(params.id);
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    milestone.status = 'PAID';
    milestone.paidAt = now;

    const contract = contracts.find((c) => c.id === milestone.contractId);

    // Auto-create Payment
    const payment: PaymentResponse = {
      id: Date.now(),
      milestoneId: milestone.id,
      contractId: milestone.contractId,
      clientId: contract ? contract.clientId : 1,
      freelancerId: contract ? contract.freelancerId : 2,
      amount: milestone.amount,
      status: 'COMPLETED',
      paidAt: now,
      createdAt: now,
    };
    payments.push(payment);

    // Check if ALL milestones for this contract are now PAID
    const contractMilestones = milestones.filter((m) => m.contractId === milestone.contractId);
    const allPaid = contractMilestones.length > 0 && contractMilestones.every((m) => m.status === 'PAID');

    if (allPaid && contract) {
      contract.status = 'COMPLETED';
      const project = projects.find((p) => p.id === contract.projectId);
      if (project) {
        project.status = 'COMPLETED';
      }
    }

    return HttpResponse.json(milestone);
  }),

  http.patch('*/milestones/:id/reject', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { reason: string };
    const milestone = milestones.find((m) => m.id === id);
    if (!milestone) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Milestone not found' },
        { status: 404 }
      );
    }
    milestone.status = 'REJECTED';
    milestone.rejectionReason = body.reason;
    return HttpResponse.json(milestone);
  }),

  // ==========================================
  // PAYMENTS
  // ==========================================
  http.get('*/payments/:id', ({ params }) => {
    const id = Number(params.id);
    const payment = payments.find((p) => p.id === id);
    if (!payment) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Payment not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(payment);
  }),

  http.get('*/payments/milestone/:milestoneId', ({ params }) => {
    const milestoneId = Number(params.milestoneId);
    const payment = payments.find((p) => p.milestoneId === milestoneId);
    if (!payment) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 404, message: 'Payment not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(payment);
  }),
];
