import React from 'react';
import { Star, Users, Award } from 'lucide-react';

const TrustSection = () => {
  const metrics = [
    { number: '100+', label: 'Villages Reached', icon: Users },
    { number: '2000+', label: 'Women Skilled', icon: Star },
    { number: '20+', label: 'Temples Revived', icon: Award },
    { number: '5+', label: 'Years of Service', icon: Users },
  ];

  const testimonials = [
    {
      quote: "Garuda Dhhruvam's temple work rekindled our community's spiritual heartbeat.",
      author: "Aruna Devi",
      role: "Kurnool Temple Priestess"
    },
    {
      quote: "The skill training gave me independence I never thought possible.",
      author: "Lakshmi Reddy",
      role: "Artisan, Anantapur"
    },
    {
      quote: "They don't just restore temples; they restore hope in our villages.",
      author: "Rama Krishna",
      role: "Village Elder, Chittoor"
    }
  ];

  const partners = [
    "Traditional Art Institutions",
    "Ayurveda Colleges",
    "Grassroots Federations",
    "Cultural Heritage Trusts"
  ];

  return (
    <section id="trust" className="py-24 px-6 lg:px-20 max-w-7xl mx-auto bg-ivory">
      <h2 className="text-center text-4xl font-semibold text-primary mb-12">
        Why Trust Garuda Dhhruvam?
      </h2>

      {/* Metrics */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-10 px-2 min-w-max">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="min-w-[200px] bg-white border border-sandalwood rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">
                  <IconComponent className="w-8 h-8 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {metric.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-accent p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <blockquote className="text-sm italic text-foreground/80 leading-relaxed mb-4">
              "{testimonial.quote}"
            </blockquote>
            <div>
              <div className="font-semibold text-primary text-sm">
                — {testimonial.author}
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                {testimonial.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Endorsements */}
      <div className="mt-16 text-center">
        <h3 className="text-lg font-medium text-primary mb-6">
          Endorsed by institutions and communities
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-white/50 border border-sandalwood rounded-lg text-sm text-muted-foreground hover:bg-white transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full">
          <Award className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-accent">
            ISO 9001:2015 Certified NGO
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;