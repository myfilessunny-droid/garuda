import React from 'react';

const AreaOfWorkSection = () => {
  const workAreas = [
    {
      id: 'temples',
      icon: '🛕',
      title: 'Temple Restoration'
    },
    {
      id: 'goshala',
      icon: '🐄',
      title: 'Goshala Management'
    },
    {
      id: 'women',
      icon: '👩🏽‍🌾',
      title: 'Women Empowerment'
    },
    {
      id: 'skills',
      icon: '🛠️',
      title: 'Skill Development'
    },
    {
      id: 'children',
      icon: '🏠',
      title: 'Child Homes'
    },
    {
      id: 'ayurveda',
      icon: '🌿',
      title: 'R&D Ayurveda (Dhanvantri)'
    }
  ];

  return (
    <section id="work" className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-semibold text-primary mb-12">
        Our Work in Action
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {workAreas.map((area) => (
          <div
            key={area.id}
            className="group relative bg-ivory border border-sandalwood rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">{area.icon}</div>
              <h3 className="text-xl font-bold text-primary">
                {area.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-lg text-muted-foreground mb-6">
          Each initiative is rooted in community needs and cultural preservation
        </p>
      </div>
    </section>
  );
};

export default AreaOfWorkSection;