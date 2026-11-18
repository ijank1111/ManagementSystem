export type UserRole = 'CONSUMER' | 'AGENT' | 'SUPPORT' | 'MANAGER' | 'ADMIN';

export type ComplaintStatus = 
  | 'LOGGED' 
  | 'ASSIGNED_AGENT' 
  | 'ASSIGNED_SUPPORT' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'AWAITING_CONFIRMATION' 
  | 'CLOSED';

export interface Tenant {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  assignedToId?: string;
  tenantId: string;
  resolutionNotes?: string;
}

export interface ActivityLog {
  id: string;
  complaintId: string;
  userId: string;
  action: string;
  timestamp: string;
  note?: string;
}