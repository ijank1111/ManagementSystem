import { useState, useEffect } from 'react';
import { User, Tenant, UserRole, Complaint, ActivityLog } from '../types/cms';
import { supabase } from '@/integrations/supabase/client';

// Static configuration for supported tenants
const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'HSBC UK', logo: 'H', primaryColor: '#db0011' },
  { id: 't2', name: 'Vodafone', logo: 'V', primaryColor: '#e60000' },
];

/**
 * Generates a human-readable short ID for complaints
 */
const generateShortId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface CMSState {
  currentUser: User | null;
  currentTenant: Tenant | null;
  userProfiles: any[]; 
  tenants: Tenant[];
  complaints: Complaint[];
  activityLogs: ActivityLog[];
  notifications: string[];
  loading: boolean;
  initialized: boolean;
}

// Internal state management
let state: CMSState = {
  currentUser: null,
  currentTenant: null,
  userProfiles: [],
  tenants: MOCK_TENANTS,
  complaints: [],
  activityLogs: [],
  notifications: [],
  loading: true,
  initialized: false,
};

const listeners = new Set<(s: CMSState) => void>();

const setState = (newState: Partial<CMSState>) => {
  state = { ...state, ...newState };
  listeners.forEach((listener) => listener(state));
};

/**
 * Core initialization logic
 */
const initialize = async () => {
  if (state.initialized) return;
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await fetchAllProfiles(session.user.id);
  } else {
    setState({ loading: false, initialized: true });
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session) {
        // Background refresh - don't set loading to true if we already have data
        await fetchAllProfiles(session.user.id, false);
      }
    } else if (event === 'SIGNED_OUT') {
      setState({ 
        currentUser: null, 
        currentTenant: null, 
        userProfiles: [], 
        complaints: [], 
        activityLogs: [], 
        loading: false,
        initialized: true
      });
    }
  });
};

const fetchAllProfiles = async (userId: string, showLoading = true) => {
  if (showLoading && !state.initialized) {
    setState({ loading: true });
  }
  
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (profiles) {
      setState({ userProfiles: profiles, loading: false, initialized: true });
      
      // If we already have a selected user, update their data from the new profile
      if (state.currentUser) {
        const updatedProfile = profiles.find(p => p.tenant_id === state.currentUser?.tenantId);
        if (updatedProfile) {
          setState({
            currentUser: {
              ...state.currentUser,
              name: updatedProfile.name,
              role: updatedProfile.role as UserRole
            }
          });
        }
      }
    } else {
      setState({ loading: false, initialized: true });
    }
  } catch (err) {
    console.error('Failed to fetch user profiles:', err);
    setState({ loading: false, initialized: true });
  }
};

const fetchData = async (tenantId: string) => {
  const [complaintsRes, logsRes] = await Promise.all([
    supabase
      .from('complaints')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false }),
    supabase
      .from('activity_logs')
      .select('*, complaints!inner(tenant_id)')
      .eq('complaints.tenant_id', tenantId)
      .order('timestamp', { ascending: false })
  ]);

  const mappedComplaints: Complaint[] = (complaintsRes.data || []).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status,
    priority: c.priority,
    category: c.category,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    customerId: c.customer_id,
    tenantId: c.tenant_id
  }));

  const mappedLogs: ActivityLog[] = (logsRes.data || []).map(l => ({
    id: l.id,
    complaintId: l.complaint_id,
    userId: l.user_id,
    action: l.action,
    timestamp: l.timestamp,
    note: l.note
  }));

  setState({ 
    complaints: mappedComplaints, 
    activityLogs: mappedLogs 
  });
};

// Trigger initial load
initialize();

export const useStore = () => {
  const [currentStore, setCurrentStore] = useState(state);

  useEffect(() => {
    listeners.add(setCurrentStore);
    return () => {
      listeners.delete(setCurrentStore);
    };
  }, []);

  const selectAccount = (tenantId: string) => {
    const profile = state.userProfiles.find(p => p.tenant_id === tenantId);
    const tenant = MOCK_TENANTS.find(t => t.id === tenantId);
    
    if (profile && tenant) {
      setState({ 
        currentUser: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as UserRole,
          tenantId: profile.tenant_id
        },
        currentTenant: tenant
      });
      fetchData(tenantId);
    }
  };

  const joinOrganization = async (tenantId: string, role: UserRole) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: session.user.id,
        email: session.user.email,
        name: session.user.email?.split('@')[0],
        role: role,
        tenant_id: tenantId
      }]);

    if (!error) {
      await fetchAllProfiles(session.user.id, false);
    }
    return error;
  };

  const logout = async () => {
    // Explicitly clear state first for immediate UI feedback
    setState({ 
      currentUser: null, 
      currentTenant: null, 
      userProfiles: [], 
      complaints: [], 
      activityLogs: [], 
      loading: false 
    });
    await supabase.auth.signOut();
  };

  const addComplaint = async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const shortId = generateShortId();
    const { data } = await supabase
      .from('complaints')
      .insert([{
        id: shortId,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        customer_id: complaint.customerId,
        tenant_id: complaint.tenantId
      }])
      .select()
      .single();

    if (data && state.currentTenant) {
      fetchData(state.currentTenant.id);
    }
  };

  const updateComplaintStatus = async (id: string, status: Complaint['status'], note?: string) => {
    await supabase
      .from('complaints')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    await addMessage(id, note || `Status changed to ${status}`, false, `Status changed to ${status}`);
    if (state.currentTenant) fetchData(state.currentTenant.id);
  };

  const addMessage = async (complaintId: string, note: string, isInternal: boolean = false, customAction?: string) => {
    const isAgent = state.currentUser?.role !== 'CONSUMER';
    const action = customAction || (isInternal ? 'Internal Note' : (isAgent ? 'Agent Response' : 'Customer Reply'));
    
    await supabase
      .from('activity_logs')
      .insert([{
        complaint_id: complaintId,
        user_id: state.currentUser?.id,
        action,
        note
      }]);

    if (state.currentTenant) fetchData(state.currentTenant.id);
  };

  const clearNotification = (complaintId: string) => {
    setState({ notifications: state.notifications.filter(id => id !== complaintId) });
  };

  return {
    ...currentStore,
    isRegistered: state.userProfiles.length > 0,
    selectAccount,
    joinOrganization,
    logout,
    addComplaint,
    updateComplaintStatus,
    addMessage,
    clearNotification
  };
};