import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Receipt } from "lucide-react";

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  currency: string;
  donation_type: string;
  purpose: string;
  payment_status: string;
  payment_method: string;
  transaction_id: string;
  notes: string;
  is_anonymous: boolean;
  receipt_sent: boolean;
  created_at: string;
}

const DonationsManager = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: 0,
    currency: 'INR',
    donation_type: 'one_time',
    purpose: 'general',
    payment_status: 'pending',
    payment_method: 'online',
    transaction_id: '',
    notes: '',
    is_anonymous: false,
    receipt_sent: false
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      toast.error('Failed to fetch donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingDonation) {
        const { error } = await supabase
          .from('donations')
          .update(formData)
          .eq('id', editingDonation.id);

        if (error) throw error;
        toast.success('Donation updated successfully');
      } else {
        const { error } = await supabase
          .from('donations')
          .insert([formData]);

        if (error) throw error;
        toast.success('Donation recorded successfully');
      }

      setShowForm(false);
      setEditingDonation(null);
      resetForm();
      fetchDonations();
    } catch (error) {
      toast.error('Failed to save donation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation record?')) return;

    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Donation deleted successfully');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to delete donation');
    }
  };

  const resetForm = () => {
    setFormData({
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      amount: 0,
      currency: 'INR',
      donation_type: 'one_time',
      purpose: 'general',
      payment_status: 'pending',
      payment_method: 'online',
      transaction_id: '',
      notes: '',
      is_anonymous: false,
      receipt_sent: false
    });
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setFormData({
      donor_name: donation.donor_name,
      donor_email: donation.donor_email || '',
      donor_phone: donation.donor_phone || '',
      amount: donation.amount,
      currency: donation.currency,
      donation_type: donation.donation_type,
      purpose: donation.purpose || 'general',
      payment_status: donation.payment_status,
      payment_method: donation.payment_method || 'online',
      transaction_id: donation.transaction_id || '',
      notes: donation.notes || '',
      is_anonymous: donation.is_anonymous,
      receipt_sent: donation.receipt_sent
    });
    setShowForm(true);
  };

  const donationTypes = [
    { value: 'one_time', label: 'One Time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const purposes = [
    { value: 'general', label: 'General' },
    { value: 'temple_restoration', label: 'Temple Restoration' },
    { value: 'goshala', label: 'Goshala' },
    { value: 'women_empowerment', label: 'Women Empowerment' },
    { value: 'child_homes', label: 'Child Homes' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const paymentMethods = [
    { value: 'online', label: 'Online' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' }
  ];

  const totalAmount = donations.reduce((sum, donation) => 
    donation.payment_status === 'completed' ? sum + donation.amount : sum, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Donations Management</h2>
          <p className="text-muted-foreground">Track and manage donations received</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Received</p>
            <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
          </div>
          <Button 
            onClick={() => {
              setShowForm(true);
              setEditingDonation(null);
              resetForm();
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Donation
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDonation ? 'Edit Donation' : 'Record New Donation'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donor_name">Donor Name *</Label>
                  <Input
                    id="donor_name"
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donor_email">Donor Email</Label>
                  <Input
                    id="donor_email"
                    type="email"
                    value={formData.donor_email}
                    onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="donor_phone">Donor Phone</Label>
                  <Input
                    id="donor_phone"
                    value={formData.donor_phone}
                    onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="donation_type">Donation Type</Label>
                  <Select value={formData.donation_type} onValueChange={(value) => setFormData({ ...formData, donation_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction_id">Transaction ID</Label>
                  <Input
                    id="transaction_id"
                    value={formData.transaction_id}
                    onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                    placeholder="Payment transaction ID"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about the donation"
                  rows={2}
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_anonymous"
                    checked={formData.is_anonymous}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: checked })}
                  />
                  <Label htmlFor="is_anonymous">Anonymous Donation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="receipt_sent"
                    checked={formData.receipt_sent}
                    onCheckedChange={(checked) => setFormData({ ...formData, receipt_sent: checked })}
                  />
                  <Label htmlFor="receipt_sent">Receipt Sent</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingDonation ? 'Update' : 'Record')} Donation
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingDonation(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {donations.map((donation) => (
          <Card key={donation.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-green-600">₹</span>
                    <h3 className="text-lg font-semibold">
                      {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      donation.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                      donation.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      donation.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {donation.payment_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Amount:</span> ₹{donation.amount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {donationTypes.find(t => t.value === donation.donation_type)?.label}
                    </div>
                    <div>
                      <span className="font-medium">Purpose:</span> {purposes.find(p => p.value === donation.purpose)?.label}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {donation.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{donation.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(donation)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(donation.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DonationsManager;