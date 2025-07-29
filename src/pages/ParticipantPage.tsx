import React, { useState } from 'react';
import { ArrowLeft, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ParticipantPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    interests: [] as string[],
    programs_of_interest: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('participants')
        .insert([{
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          status: 'active',
          registration_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast.success('Participant registration submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting participant registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest);
    setFormData({ ...formData, interests });
  };

  const handleProgramsChange = (value: string) => {
    const programs = value.split(',').map(program => program.trim()).filter(program => program);
    setFormData({ ...formData, programs_of_interest: programs });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-white border-b border-sandalwood">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Participant Registration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our programs and events to learn, grow, and be part of our community. 
            Register to participate in our various initiatives and activities.
          </p>
        </div>

        {/* Registration Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Participant Information</CardTitle>
            <CardDescription>
              Please provide your basic details to register for our programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="25"
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
              </div>

              {/* Interests and Programs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interests & Programs
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="interests">Areas of Interest (comma-separated)</Label>
                    <Input
                      id="interests"
                      value={formData.interests.join(', ')}
                      onChange={(e) => handleInterestsChange(e.target.value)}
                      placeholder="Education, Arts, Technology, Environment, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="programs_of_interest">Programs of Interest (comma-separated)</Label>
                    <Input
                      id="programs_of_interest"
                      value={formData.programs_of_interest.join(', ')}
                      onChange={(e) => handleProgramsChange(e.target.value)}
                      placeholder="Temple Restoration, Women Empowerment, Skill Development, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Participant Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-primary mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Registration Confirmation</h4>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email with your registration details
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Program Updates</h4>
              <p className="text-sm text-muted-foreground">
                We'll keep you informed about upcoming programs and events
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Start Participating</h4>
              <p className="text-sm text-muted-foreground">
                Join our programs and be part of our growing community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantPage; 