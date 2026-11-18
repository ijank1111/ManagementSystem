import { useStore } from '../store/useStore';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Complaints = () => {
  const { currentUser, complaints, notifications } = useStore();
  const navigate = useNavigate();

  // No local filtering needed - the store already provides only authorized complaints
  const displayComplaints = complaints;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="Search complaints..." className="pl-10 bg-white border-slate-200" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filters
          </Button>
          {currentUser?.role === 'CONSUMER' && (
            <Button onClick={() => navigate('/complaints/new')}>New Complaint</Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">ID</TableHead>
              <TableHead className="font-bold text-slate-700">Complaint Title</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Priority</TableHead>
              <TableHead className="font-bold text-slate-700">Created</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No complaints found.
                </TableCell>
              </TableRow>
            ) : (
              displayComplaints.map((complaint) => (
                <TableRow 
                  key={complaint.id} 
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors relative"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  <TableCell className="font-mono text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      {notifications.includes(complaint.id) && (
                        <Bell size={12} className="text-primary animate-bounce" />
                      )}
                      {complaint.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{complaint.title}</div>
                    <div className="text-xs text-slate-500">{complaint.category}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={complaint.status} />
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                      complaint.priority === 'URGENT' ? "bg-red-50 text-red-600" :
                      complaint.priority === 'HIGH' ? "bg-orange-50 text-orange-600" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {complaint.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Complaints;