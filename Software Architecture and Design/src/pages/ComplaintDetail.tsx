import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle, 
  Send,
  Lock,
  User,
  Headphones,
  ShieldAlert
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '../utils/toast';
import { cn } from '@/lib/utils';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, currentTenant, complaints, activityLogs, updateComplaintStatus, addMessage, clearNotification } = useStore();
  const [message, setMessage] = useState('');
  
  // Strictly filter by tenant ID and ownership for consumers
  const complaint = complaints.find(c => {
    const matchesId = c.id === id;
    const matchesTenant = c.tenantId === currentTenant?.id;
    if (currentUser?.role === 'CONSUMER') {
      return matchesId && matchesTenant && c.customerId === currentUser.id;
    }
    return matchesId && matchesTenant;
  });

  const logs = activityLogs.filter(l => l.complaintId === id);

  useEffect(() => {
    if (id && complaint) {
      clearNotification(id);
    }
  }, [id, complaint]);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-red-50 rounded-full text-red-600">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 text-center max-w-md">
          This complaint does not exist or you do not have permission to view it within the current organization context.
        </p>
        <Button variant="outline" onClick={() => navigate('/complaints')}>
          Return to Complaints
        </Button>
      </div>
    );
  }

  const handleSendMessage = (isInternal: boolean = false) => {
    if (!message.trim()) return;
    addMessage(complaint.id, message, isInternal);
    setMessage('');
    showSuccess(isInternal ? "Internal note added" : "Message sent");
  };

  const handleResolve = () => {
    updateComplaintStatus(complaint.id, 'RESOLVED', 'Issue marked as resolved by agent');
    showSuccess("Complaint marked as resolved");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" className="gap-2 -ml-2 text-slate-500" onClick={() => navigate('/complaints')}>
        <ArrowLeft size={18} />
        Back to List
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono font-bold text-slate-400">{complaint.id}</span>
                <StatusBadge status={complaint.status} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{complaint.title}</h1>
            </div>
            <div className="flex gap-2">
              {(currentUser?.role === 'AGENT' || currentUser?.role === 'SUPPORT') && complaint.status !== 'RESOLVED' && (
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleResolve}>
                  <CheckCircle size={18} />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
              <div className="mt-6 flex gap-4">
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                  <p className="font-semibold text-slate-700">{complaint.category}</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Priority</p>
                  <p className="font-semibold text-slate-700">{complaint.priority}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Activity & Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {logs.length === 0 && <p className="text-center text-slate-400 py-8">No activity yet</p>}
                {logs.map((log) => (
                  <div key={log.id} className={cn(
                    "flex gap-4",
                    log.action === 'Internal Note' ? "opacity-80" : ""
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      log.action === 'Internal Note' ? "bg-amber-100 text-amber-600" : 
                      log.action === 'Agent Response' ? "bg-indigo-100 text-indigo-600" :
                      "bg-blue-100 text-blue-600"
                    )}>
                      {log.action === 'Internal Note' ? <Lock size={14} /> : 
                       log.action === 'Agent Response' ? <Headphones size={14} /> : <User size={14} />}
                    </div>
                    <div className={cn(
                      "flex-1 p-4 rounded-2xl rounded-tl-none",
                      log.action === 'Internal Note' ? "bg-amber-50 border border-amber-100" : 
                      log.action === 'Agent Response' ? "bg-indigo-50 border border-indigo-100" :
                      "bg-slate-50"
                    )}>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{log.action}</p>
                      <p className="text-sm text-slate-700">{log.note || log.action}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {complaint.status !== 'RESOLVED' && (
                <div className="pt-4 border-t">
                  <Textarea 
                    placeholder="Type your response..." 
                    className="min-h-[100px] bg-white border-slate-200 rounded-xl" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex justify-between mt-3">
                    <div className="flex gap-2">
                      {currentUser?.role !== 'CONSUMER' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => handleSendMessage(true)}
                        >
                          Internal Note
                        </Button>
                      )}
                    </div>
                    <Button size="sm" className="gap-2" onClick={() => handleSendMessage(false)}>
                      <Send size={14} />
                      {currentUser?.role === 'CONSUMER' ? 'Reply to Agent' : 'Reply to Customer'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Complaint Logged</p>
                  <p className="text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
                {complaint.status === 'RESOLVED' && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Resolved</p>
                    <p className="text-xs text-slate-500">{new Date(complaint.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;