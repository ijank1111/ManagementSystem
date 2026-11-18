import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { currentUser, currentTenant, complaints } = useStore();
  const navigate = useNavigate();

  const displayComplaints = complaints;
  
  const stats = [
    { label: 'Total Active', value: displayComplaints.length, icon: AlertCircle, color: 'text-blue-600' },
    { label: 'In Progress', value: displayComplaints.filter(c => c.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-amber-600' },
    { label: 'Resolved', value: displayComplaints.filter(c => c.status === 'RESOLVED').length, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = days.map(day => ({
    name: day,
    count: displayComplaints.filter(c => {
      const date = new Date(c.createdAt);
      return date.toLocaleDateString('en-US', { weekday: 'short' }) === day;
    }).length
  }));

  const categories = Array.from(new Set(displayComplaints.map(c => c.category)));
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#94a3b8'];
  const pieData = categories.map((cat, i) => ({
    name: cat || 'Uncategorized',
    value: displayComplaints.filter(c => c.category === cat).length,
    color: colors[i % colors.length]
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser?.name}</h1>
        </div>
        {currentUser?.role === 'CONSUMER' && (
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => navigate('/complaints/new')}>
            <Plus size={18} />
            Log New Complaint
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color)}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Complaint Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {displayComplaints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data to display</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-medium text-slate-600 truncate max-w-[80px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-sm">No categories yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Complaints</CardTitle>
          </div>
          <Button variant="ghost" className="text-primary font-semibold" onClick={() => navigate('/complaints')}>
            View All <ArrowRight size={16} className="ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {displayComplaints.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No complaints found.</div>
            ) : (
              displayComplaints.slice(0, 3).map((complaint) => (
                <div key={complaint.id} className="py-4 flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/complaints/${complaint.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] bg-slate-100 text-slate-600",
                      complaint.priority === 'URGENT' && "bg-red-100 text-red-600"
                    )}>
                      {complaint.id}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{complaint.title}</h4>
                      <p className="text-sm text-slate-500">Logged {new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <StatusBadge status={complaint.status} />
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;