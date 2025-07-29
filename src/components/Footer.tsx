import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  office_hours: string;
}

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('website_contact')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch contact data:', error);
      } else {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;
      
      setEmail('');
      alert('Thank you for subscribing to our newsletter!');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'Follow us on LinkedIn' },
    { icon: Instagram, href: '#', label: 'Follow us on Instagram' },
    { icon: Youtube, href: '#', label: 'Follow us on YouTube' }
  ];

  return (
    <footer id="contact" className="bg-ivory border-t border-sandalwood">
      <div className="py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Mail className="w-4 h-4 text-accent" />
                  <a 
                    href={`mailto:${contactInfo?.email || 'hello@garudadhruvam.org'}`}
                    className="hover:text-accent transition-colors"
                  >
                    {contactInfo?.email || 'hello@garudadhruvam.org'}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Phone className="w-4 h-4 text-accent" />
                  <a 
                    href={`tel:${contactInfo?.phone || '+919876543210'}`}
                    className="hover:text-accent transition-colors"
                  >
                    {contactInfo?.phone || '+91 98765 43210'}
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm text-foreground/80">
                  <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span>{contactInfo?.address || 'Kurnool, Andhra Pradesh, India'}</span>
                </div>
                {contactInfo?.office_hours && (
                  <div className="flex items-center gap-3 text-sm text-foreground/80">
                    <span className="text-accent">🕒</span>
                    <span>{contactInfo.office_hours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Newsletter Signup */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Get updates from the ground
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-sandalwood text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground px-5 py-2 rounded-xl hover:bg-accent/90 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-sandalwood text-muted-foreground hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-sandalwood pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  © 2025 Garuda Dhruvam Foundation. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">
                  ISO 9001:2015 Certified NGO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;