import { ComplaintStatus } from '../types/cms';
import { cn } from '@/lib/utils';

const statusConfig: Record<ComplaintStatus, { label: string; color: string }> = {
  LOGGED: { label: 'Logged', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ASSIGNED_AGENT: { label: 'Assigned to Agent', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ASSIGNED_SUPPORT: { label: 'Assigned to Support', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  RESOLVED: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  AWAITING_CONFIRMATION: { label: 'Awaiting Confirmation', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  CLOSED: { label: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const config = statusConfig[status];
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", config.color)}>
      {config.label}
    </span>
  );
};