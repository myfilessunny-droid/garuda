import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle } from "lucide-react";

interface Participant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  programs_of_interest: string[];
  status: string;
  registration_date: string;
  created_at: string;
}

const ParticipantsManager = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    interests: [] as string[],
    programs_of_interest: [] as string[],
    status: 'active'
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      toast.error('Failed to fetch participants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingParticipant) {
        const { error } = await supabase
          .from('participants')
          .update({
            ...formData,
            age: formData.age ? parseInt(formData.age) : null
          })
          .eq('id', editingParticipant.id);

        if (error) throw error;
        toast.success('Participant updated successfully');
      } else {
        const { error } = await supabase
          .from('participants')
          .insert([{
            ...formData,
            age: formData.age ? parseInt(formData.age) : null
          }]);

        if (error) throw error;
        toast.success('Participant added successfully');
      }

      setShowForm(false);
      setEditingParticipant(null);
      resetForm();
      fetchParticipants();
    } catch (error) {
      toast.error('Failed to save participant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;

    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Participant deleted successfully');
      fetchParticipants();
    } catch (error) {
      toast.error('Failed to delete participant');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      location: '',
      interests: [],
      programs_of_interest: [],
      status: 'active'
    });
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setFormData({
      full_name: participant.full_name,
      email: participant.email,
      phone: participant.phone || '',
      age: participant.age?.toString() || '',
      gender: participant.gender || '',
      location: participant.location || '',
      interests: participant.interests || [],
      programs_of_interest: participant.programs_of_interest || [],
      status: participant.status
    });
    setShowForm(true);
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest);
    setFormData({ ...formData, interests });
  };

  const handleProgramsChange = (value: string) => {
    const programs = value.split(',').map(program => program.trim()).filter(program => program);
    setFormData({ ...formData, programs_of_interest: programs });
  };

  const activeParticipants = participants.filter(p => p.status === 'active').length;
  const totalParticipants = participants.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Participants Management</h2>
          <p className="text-muted-foreground">Manage participant registrations and information</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-blue-600">{totalParticipants}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-green-600">{activeParticipants}</p>
          </div>
          <Button 
            onClick={() => {
              setShowForm(true);
              setEditingParticipant(null);
              resetForm();
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Participant
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingParticipant ? 'Edit Participant' : 'Add New Participant'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interests">Interests (comma-separated)</Label>
                  <Input
                    id="interests"
                    value={formData.interests.join(', ')}
                    onChange={(e) => handleInterestsChange(e.target.value)}
                    placeholder="Education, Arts, Technology, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="programs_of_interest">Programs of Interest (comma-separated)</Label>
                  <Input
                    id="programs_of_interest"
                    value={formData.programs_of_interest.join(', ')}
                    onChange={(e) => handleProgramsChange(e.target.value)}
                    placeholder="Temple Restoration, Women Empowerment, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                  {isLoading ? 'Saving...' : (editingParticipant ? 'Update' : 'Add')} Participant
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingParticipant(null);
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

      <div className="grid gap-6">
        {participants.map((participant) => (
          <Card key={participant.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {participant.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={participant.status === 'active' ? 'default' : 'secondary'}>
                      {participant.status}
                    </Badge>
                    {participant.gender && (
                      <Badge variant="outline">{participant.gender}</Badge>
                    )}
                    {participant.age && (
                      <Badge variant="outline">{participant.age} years</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(participant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(participant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium">Email:</span> {participant.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {participant.phone || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {participant.location || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Registered:</span> {new Date(participant.registration_date).toLocaleDateString()}
                </div>
              </div>

              {participant.interests && participant.interests.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Interests: </span>
                  <div className="inline-flex flex-wrap gap-1">
                    {participant.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {participant.programs_of_interest && participant.programs_of_interest.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Programs: </span>
                  <div className="inline-flex flex-wrap gap-1">
                    {participant.programs_of_interest.map((program, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsManager; 