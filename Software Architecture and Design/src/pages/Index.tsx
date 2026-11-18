import { useStore } from '../store/useStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { userProfiles, tenants, selectAccount, isRegistered } = useStore();
  const navigate = useNavigate();

  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }

  const handleSelect = (tenantId: string) => {
    selectAccount(tenantId);
    const profile = userProfiles.find(p => p.tenant_id === tenantId);
    
    if (profile?.role === 'MANAGER' || profile?.role === 'ADMIN') {
      navigate('/dashboard');
    } else {
      navigate('/complaints');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Select <span className="text-primary">Account</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {userProfiles.map((profile) => {
            const tenant = tenants.find(t => t.id === profile.tenant_id);
            return (
              <button
                key={profile.tenant_id}
                onClick={() => handleSelect(profile.tenant_id)}
                className="w-full p-6 rounded-2xl border-2 border-white bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-6 group text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  {tenant?.logo || 'RP'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{tenant?.name}</h3>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    Role: {profile.role}
                  </p>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}

          <Button 
            variant="outline" 
            className="h-16 rounded-2xl border-dashed border-2 border-slate-200 hover:border-primary hover:bg-primary/5 gap-3"
            onClick={() => navigate('/join')}
          >
            <PlusCircle size={20} />
            Join another organization
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;