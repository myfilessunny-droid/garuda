import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Mail, CheckCircle, XCircle, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    is_active: true
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingSubscriber) {
        const { error } = await supabase
          .from('subscribers')
          .update({
            ...formData,
            unsubscribed_at: !formData.is_active ? new Date().toISOString() : null
          })
          .eq('id', editingSubscriber.id);

        if (error) throw error;
        toast.success('Subscriber updated successfully');
      } else {
        const { error } = await supabase
          .from('subscribers')
          .insert([formData]);

        if (error) throw error;
        toast.success('Subscriber added successfully');
      }

      setShowForm(false);
      setEditingSubscriber(null);
      resetForm();
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to save subscriber');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      is_active: true
    });
  };

  const handleEdit = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      is_active: subscriber.is_active
    });
    setShowForm(true);
  };

  const exportSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const csvContent = [
        'Email,Subscribed Date,Status',
        ...data.map(sub => `${sub.email},${new Date(sub.subscribed_at).toLocaleDateString()},${sub.is_active ? 'Active' : 'Inactive'}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Subscribers exported successfully');
    } catch (error) {
      toast.error('Failed to export subscribers');
    }
  };

  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const totalSubscribers = subscribers.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Newsletter Subscribers</h2>
          <p className="text-muted-foreground">Manage newsletter subscriptions and subscriber information</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-green-600">{activeSubscribers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-blue-600">{totalSubscribers}</p>
          </div>
          <Button onClick={exportSubscribers} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button 
            onClick={() => {
              setShowForm(true);
              setEditingSubscriber(null);
              resetForm();
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingSubscriber ? 'Update' : 'Add')} Subscriber
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingSubscriber(null);
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
        {subscribers.map((subscriber) => (
          <Card key={subscriber.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium">{subscriber.email}</h3>
                    <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                      {subscriber.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}</p>
                    {subscriber.unsubscribed_at && (
                      <p>Unsubscribed: {new Date(subscriber.unsubscribed_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(subscriber)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(subscriber.id)}>
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

export default SubscribersManager; 