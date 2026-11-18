import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send } from 'lucide-react';
import { showSuccess } from '../utils/toast';

const NewComplaint = () => {
  const navigate = useNavigate();
  const { currentUser, currentTenant, addComplaint } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'MEDIUM' as any,
    description: ''
  });

  const bankCategories = [
    { value: 'false_transaction', label: 'Report false Transaction' },
    { value: 'stolen_card', label: 'Report stolen debit card / credit card' },
    { value: 'block_unblock', label: 'Block/unblock debit card/ credit card' },
    { value: 'reissue_card', label: 'Request reissue of debit card/credit card' },
    { value: 'atm_false_transaction', label: 'Report false Transaction from ATM' },
    { value: 'new_deposit', label: 'Open new deposit' },
  ];

  const mobileCategories = [
    { value: 'renew_contract', label: 'Renew contract' },
    { value: 'block_unblock_sim', label: 'Block/Unblock SIM' },
    { value: 'stolen_sim', label: 'Report stolen SIM' },
    { value: 'reorder_sim', label: 'Reorder SIM' },
    { value: 'broadband_complaint', label: 'Complain about Broadband' },
  ];

  const defaultCategories = [
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'service', label: 'Service Quality' },
    { value: 'fraud', label: 'Fraud / Security' },
    { value: 'other', label: 'Other' },
  ];

  const getCategories = () => {
    if (currentTenant?.id === 't1') return bankCategories;
    if (currentTenant?.id === 't2') return mobileCategories;
    return defaultCategories;
  };

  const categories = getCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentTenant) return;
    
    setLoading(true);
    
    addComplaint({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      customerId: currentUser.id,
      tenantId: currentTenant.id
    });

    setTimeout(() => {
      showSuccess("Complaint logged successfully.");
      setLoading(false);
      navigate('/complaints');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        className="gap-2 -ml-2 text-slate-500" 
        onClick={() => navigate('/complaints')}
      >
        <ArrowLeft size={18} />
        Back to Complaints
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Log New Complaint</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title</Label>
              <Input 
                id="title" 
                placeholder="Brief summary of the issue" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  required 
                  onValueChange={(v) => setFormData({...formData, category: v})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  defaultValue="MEDIUM"
                  onValueChange={(v) => setFormData({...formData, priority: v as any})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what happened..." 
                className="min-h-[150px]"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/complaints')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                <Send size={18} />
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewComplaint;