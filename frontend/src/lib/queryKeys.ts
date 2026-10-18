export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
    freelancers: ['users', 'freelancers'] as const,
  },

  // Projects
  projects: {
    all: ['projects'] as const,
    list: (params?: unknown) => ['projects', 'list', params] as const,
    detail: (id: number) => ['projects', 'detail', id] as const,
    myProjects: (clientId?: number) => ['projects', 'my', clientId] as const,
  },

  // Bids
  bids: {
    all: ['bids'] as const,
    detail: (id: number) => ['bids', 'detail', id] as const,
    byProject: (projectId: number) => ['bids', 'byProject', projectId] as const,
    byFreelancer: (freelancerId: number) => ['bids', 'byFreelancer', freelancerId] as const,
  },

  // Contracts
  contracts: {
    all: ['contracts'] as const,
    detail: (id: number) => ['contracts', 'detail', id] as const,
    byClient: (clientId: number) => ['contracts', 'byClient', clientId] as const,
    byFreelancer: (freelancerId: number) => ['contracts', 'byFreelancer', freelancerId] as const,
  },

  // Milestones
  milestones: {
    all: ['milestones'] as const,
    detail: (id: number) => ['milestones', 'detail', id] as const,
    byContract: (contractId: number) => ['milestones', 'byContract', contractId] as const,
  },

  // Payments
  payments: {
    all: ['payments'] as const,
    detail: (id: number) => ['payments', 'detail', id] as const,
    byMilestone: (milestoneId: number) => ['payments', 'byMilestone', milestoneId] as const,
  },
};
