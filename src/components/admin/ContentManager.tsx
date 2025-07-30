import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";
import { useWebsiteHero } from "@/hooks/useWebsiteHero";
import { useWebsiteMission } from "@/hooks/useWebsiteMission";
import { useWebsiteStats } from "@/hooks/useWebsiteStats";
import { useWebsiteContact } from "@/hooks/useWebsiteContact";
import { useState, useEffect } from "react";

const ContentManager = () => {
  const { heroData, loading: heroLoading, updateHeroData, refetch: refetchHero } = useWebsiteHero();
  const { missionData, loading: missionLoading, updateMissionData, refetch: refetchMission } = useWebsiteMission();
  const { statsData, loading: statsLoading, updateStatsData, refetch: refetchStats } = useWebsiteStats();
  const { contactData, loading: contactLoading, updateContactData, refetch: refetchContact } = useWebsiteContact();

  // Local state for form inputs
  const [localHero, setLocalHero] = useState({
    title: '',
    subtitle: '',
    cta_primary: '',
    cta_secondary: ''
  });

  const [localMission, setLocalMission] = useState({
    mission_text: '',
    vision: '',
    philosophy: ''
  });

  const [localStats, setLocalStats] = useState({
    villages: 0,
    women_skilled: 0,
    temples_revived: 0,
    programs_active: 0
  });

  const [localContact, setLocalContact] = useState({
    email: '',
    phone: '',
    address: '',
    office_hours: ''
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (heroData) {
      setLocalHero({
        title: heroData.title || '',
        subtitle: heroData.subtitle || '',
        cta_primary: heroData.cta_primary || '',
        cta_secondary: heroData.cta_secondary || ''
      });
    }
  }, [heroData]);

  useEffect(() => {
    if (missionData) {
      setLocalMission({
        mission_text: missionData.mission_text || '',
        vision: missionData.vision || '',
        philosophy: missionData.philosophy || ''
      });
    }
  }, [missionData]);

  useEffect(() => {
    if (statsData) {
      setLocalStats({
        villages: statsData.villages || 0,
        women_skilled: statsData.women_skilled || 0,
        temples_revived: statsData.temples_revived || 0,
        programs_active: statsData.programs_active || 0
      });
    }
  }, [statsData]);

  useEffect(() => {
    if (contactData) {
      setLocalContact({
        email: contactData.email || '',
        phone: contactData.phone || '',
        address: contactData.address || '',
        office_hours: contactData.office_hours || ''
      });
    }
  }, [contactData]);

  const isLoading = heroLoading || missionLoading || statsLoading || contactLoading;

  const handleRefresh = () => {
    refetchHero();
    refetchMission();
    refetchStats();
    refetchContact();
  };

  const handleHeroSave = async () => {
    const result = await updateHeroData(localHero);
    
    if (result.success) {
      toast.success('Hero section updated successfully');
    } else {
      toast.error('Failed to update hero section');
    }
  };

  const handleMissionSave = async () => {
    const result = await updateMissionData(localMission);
    
    if (result.success) {
      toast.success('Mission section updated successfully');
    } else {
      toast.error('Failed to update mission section');
    }
  };

  const handleStatsSave = async () => {
    const result = await updateStatsData(localStats);
    
    if (result.success) {
      toast.success('Statistics updated successfully');
    } else {
      toast.error('Failed to update statistics');
    }
  };

  const handleContactSave = async () => {
    const result = await updateContactData(localContact);
    
    if (result.success) {
      toast.success('Contact information updated successfully');
    } else {
      toast.error('Failed to update contact information');
    }
  };

  if (isLoading) {
    return <div>Loading website content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Website Content Management</h2>
          <p className="text-muted-foreground">Update website sections and content</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">Main Title</Label>
            <Input
              id="hero_title"
              value={localHero.title}
              onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
              placeholder="Main hero title"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              value={localHero.subtitle}
              onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })}
              placeholder="Hero subtitle"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero_cta_primary">Primary CTA Text</Label>
              <Input
                id="hero_cta_primary"
                value={localHero.cta_primary}
                onChange={(e) => setLocalHero({ ...localHero, cta_primary: e.target.value })}
                placeholder="Primary button text"
              />
            </div>
            <div>
              <Label htmlFor="hero_cta_secondary">Secondary CTA Text</Label>
              <Input
                id="hero_cta_secondary"
                value={localHero.cta_secondary}
                onChange={(e) => setLocalHero({ ...localHero, cta_secondary: e.target.value })}
                placeholder="Secondary button text"
              />
            </div>
          </div>
          <Button onClick={handleHeroSave} disabled={heroLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Hero Section
          </Button>
        </CardContent>
      </Card>

      {/* Mission, Vision, Philosophy */}
      <Card>
        <CardHeader>
          <CardTitle>Mission, Vision & Philosophy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={localMission.mission_text}
              onChange={(e) => setLocalMission({ ...localMission, mission_text: e.target.value })}
              placeholder="Organization mission"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              value={localMission.vision}
              onChange={(e) => setLocalMission({ ...localMission, vision: e.target.value })}
              placeholder="Organization vision"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="philosophy">Philosophy</Label>
            <Textarea
              id="philosophy"
              value={localMission.philosophy}
              onChange={(e) => setLocalMission({ ...localMission, philosophy: e.target.value })}
              placeholder="Organization philosophy"
              rows={3}
            />
          </div>
          <Button onClick={handleMissionSave} disabled={missionLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Mission Section
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="villages">Villages Reached</Label>
              <Input
                id="villages"
                type="number"
                value={localStats.villages}
                onChange={(e) => setLocalStats({ ...localStats, villages: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="women_skilled">Women Skilled</Label>
              <Input
                id="women_skilled"
                type="number"
                value={localStats.women_skilled}
                onChange={(e) => setLocalStats({ ...localStats, women_skilled: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="temples_revived">Temples Revived</Label>
              <Input
                id="temples_revived"
                type="number"
                value={localStats.temples_revived}
                onChange={(e) => setLocalStats({ ...localStats, temples_revived: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="programs_active">Active Programs</Label>
              <Input
                id="programs_active"
                type="number"
                value={localStats.programs_active}
                onChange={(e) => setLocalStats({ ...localStats, programs_active: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={handleStatsSave} disabled={statsLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Statistics
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={localContact.email}
                onChange={(e) => setLocalContact({ ...localContact, email: e.target.value })}
                placeholder="hello@garudaDhhruvam.org"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={localContact.phone}
                onChange={(e) => setLocalContact({ ...localContact, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contact_address">Address</Label>
            <Textarea
              id="contact_address"
              value={localContact.address}
              onChange={(e) => setLocalContact({ ...localContact, address: e.target.value })}
              placeholder="Organization address"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="office_hours">Office Hours</Label>
            <Input
              id="office_hours"
              value={localContact.office_hours}
              onChange={(e) => setLocalContact({ ...localContact, office_hours: e.target.value })}
              placeholder="Mon-Fri 9:00 AM - 5:00 PM"
            />
          </div>
          <Button onClick={handleContactSave} disabled={contactLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Contact Info
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;