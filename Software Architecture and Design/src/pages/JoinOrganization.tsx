"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, ArrowLeft, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { showSuccess, showError } from '../utils/toast';
import { UserRole } from '../types/cms';

const JoinOrganization = () => {
  const { tenants, userProfiles, joinOrganization } = useStore();
  const [tenantId, setTenantId] = useState('');
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Filter out organizations the user is already part of
  const availableTenants = tenants.filter(
    t => !userProfiles.some(p => p.tenant_id === t.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    
    setLoading(true);
    const error = await joinOrganization(tenantId, role);

    if (error) {
      showError(error.message);
      setLoading(false);
    } else {
      showSuccess("Successfully joined organization!");
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 -ml-2 text-slate-500" 
          onClick={() => navigate('/onboarding')}
        >
          <ArrowLeft size={18} />
          Back to Accounts
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Join Organization</h1>
          <p className="text-slate-500">Add a new organization to your account.</p>
        </div>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Select the organization and your role</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Select value={tenantId} onValueChange={setTenantId}>
                  <SelectTrigger id="org" className="h-12">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-slate-400" />
                      <SelectValue placeholder="Select organization" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableTenants.length > 0 ? (
                      availableTenants.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-slate-500 text-center">
                        You are already part of all organizations.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSUMER">Consumer (Customer)</SelectItem>
                    <SelectItem value="AGENT">Help Desk Agent</SelectItem>
                    <SelectItem value="SUPPORT">Support Staff</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 gap-2 text-lg font-semibold" 
                disabled={loading || !tenantId}
              >
                <UserPlus size={20} />
                {loading ? "Joining..." : "Join Organization"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinOrganization;