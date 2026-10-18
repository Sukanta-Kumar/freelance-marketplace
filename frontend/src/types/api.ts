import {
  Role,
  ProjectStatus,
  BidStatus,
  ContractStatus,
  MilestoneStatus,
  PaymentStatus,
} from './enums';

// ==========================================
// ERROR RESPONSE
// ==========================================
export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  errors?: Record<string, string>;
  path?: string;
}

// ==========================================
// PAGINATION (Spring Data Page)
// ==========================================
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

// ==========================================
// AUTH & USERS
// ==========================================
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id?: number;
  fullName?: string;
  email?: string;
  role?: Role;
  token: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  status?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
}

// ==========================================
// PROJECTS
// ==========================================
export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string; // ISO date format YYYY-MM-DD
  status: ProjectStatus;
  clientId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export interface UpdateProjectStatusRequest {
  status: ProjectStatus;
}

// ==========================================
// BIDS
// ==========================================
export interface BidResponse {
  id: number;
  projectId: number;
  freelancerId: number;
  amount: number;
  proposal: string;
  estimatedDays: number;
  status: BidStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BidRequest {
  projectId: number;
  amount: number;
  proposal: string;
  estimatedDays: number;
}

export interface UpdateBidRequest {
  amount: number;
  proposal: string;
  estimatedDays: number;
}

// ==========================================
// CONTRACTS
// ==========================================
export interface ContractResponse {
  id: number;
  projectId: number;
  bidId: number;
  clientId: number;
  freelancerId: number;
  totalAmount: number;
  startDate?: string;
  endDate?: string;
  status: ContractStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContractRequest {
  projectId: number;
  bidId: number;
  clientId: number;
  freelancerId: number;
  totalAmount: number;
}

// ==========================================
// MILESTONES
// ==========================================
export interface MilestoneResponse {
  id: number;
  contractId: number;
  title: string;
  description?: string;
  amount: number;
  sequenceNumber: number;
  status: MilestoneStatus;
  submissionDescription?: string | null;
  deliverableUrl?: string | null;
  rejectionReason?: string | null;
  paidAt?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMilestoneRequest {
  contractId: number;
  title: string;
  description?: string;
  amount: number;
  sequenceNumber: number;
  dueDate?: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  amount?: number;
  sequenceNumber?: number;
}

export interface SubmitMilestoneRequest {
  description: string;
  deliverableUrl: string;
}

export interface RejectMilestoneRequest {
  reason: string;
}

// ==========================================
// PAYMENTS
// ==========================================
export interface PaymentResponse {
  id: number;
  milestoneId: number;
  contractId: number;
  clientId: number;
  freelancerId: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  createdAt?: string;
}
