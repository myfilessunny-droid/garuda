import React from 'react';
import founderPortrait from '@/assets/founder-portrait-2.jpg';

const OurStorySection = () => {
  return (
    <section id="about" className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column - Founder Image */}
        <div className="col-span-12 lg:col-span-5">
          <div className="relative">
            <img
              src={founderPortrait}
              alt="Founder Srimati J. Tejavati – cultural visionary"
              className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-[3/4] hover-lift"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-warm rounded-full opacity-20 animate-glow"></div>
          </div>
        </div>

        {/* Right Column - Story Content */}
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-4xl font-semibold text-primary mb-6">Our Story</h2>
          
          <div className="prose prose-lg">
            <p className="text-lg text-foreground/80 leading-relaxed mb-10 max-w-[65ch]">
              Garuda Dhhruvam Foundation was founded in 2025 by Srimati J. Tejavati with a sacred mission — 
              to restore India's spiritual heritage, revive forgotten temples, and empower villages through 
              culture and self-sufficiency. Inspired by principles of sustainability, equality, and tradition, 
              the organization believes that true transformation begins within our roots.
            </p>
          </div>

          {/* Principle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="card-warm p-5 hover-lift">
              <h3 className="text-md font-medium text-accent leading-snug mb-2">
                Built on action, not promises
              </h3>
              <p className="text-sm text-muted-foreground">
                Every initiative is grounded in real community needs and measurable impact.
              </p>
            </div>
            
            <div className="card-warm p-5 hover-lift">
              <h3 className="text-md font-medium text-accent leading-snug mb-2">
                On-ground. Inclusive. Restorative.
              </h3>
              <p className="text-sm text-muted-foreground">
                Working directly with communities to preserve culture while building futures.
              </p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="mt-8 p-6 bg-primary/5 border-l-4 border-accent rounded-lg">
            <p className="text-lg italic text-primary leading-relaxed">
              "When we restore a temple, we restore more than stone and mortar. 
              We restore the beating heart of a community."
            </p>
            <cite className="block mt-3 text-sm font-medium text-accent">
              — Srimati J. Tejavati, Founder
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;