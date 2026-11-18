"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, UserPlus, Building2 } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '../types/cms';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [tenantId, setTenantId] = useState('t1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const organizations = [
    { id: 't1', name: 'HSBC UK (Banking)' },
    { id: 't2', name: 'Vodafone (Telecom)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          tenant_id: tenantId,
          name: email.split('@')[0]
        }
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
        showError("You already have an account. Please sign in.");
        navigate('/login');
      } else {
        showError(error.message);
      }
      setLoading(false);
    } else {
      showSuccess("Account created successfully!");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        </div>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-10 h-12" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
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

              <Button type="submit" className="w-full h-12 gap-2 text-lg font-semibold mt-4" disabled={loading}>
                <UserPlus size={20} />
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;