import React, { useState, useEffect } from 'react';
import { ExternalLink, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  location: string | null;
}

interface Story {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  category: string;
  status: string;
  author_name: string | null;
  author_role: string | null;
  read_time_minutes: number | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

const ShowcaseSection = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
    fetchFeaturedStories();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_featured', true)
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    }
  };

  const fetchFeaturedStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .limit(3)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Failed to fetch featured stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="stories" className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-semibold text-primary mb-16">
        Stories from the Ground
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Column - Stories & Blogs */}
        <div>
          <h3 className="text-xl font-semibold text-accent mb-6">
            Voices of Change
          </h3>
          
          <div className="space-y-6">
            {loading ? (
              // Loading placeholders
              Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className="bg-white border-l-4 border-sandalwood p-6 rounded-xl shadow-md animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </article>
              ))
            ) : (
              // Actual stories
              stories.map((story, index) => (
                <article
                  key={story.id}
                  className="bg-white border-l-4 border-sandalwood p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-medium text-primary mb-2 leading-snug">
                    {story.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {story.excerpt || 'Read our latest story from the ground...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {story.read_time_minutes || 5} min read
                    </span>
                    <button className="story-link text-sm text-accent hover:text-accent/80 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1">
                      Read More
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Visual Grid */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              // Loading placeholders
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gradient-to-br from-sandalwood/20 to-accent/10 flex items-center justify-center animate-pulse"
                >
                  <Camera className="w-8 h-8 text-accent/40" />
                </div>
              ))
            ) : (
              // Actual gallery images
              galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover aspect-square"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ExternalLink className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{image.title}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <a href="/stories" className="btn-primary">
              See Our Stories
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-ivory border border-sandalwood rounded-2xl">
          <div>
            <div className="text-2xl font-bold text-accent">50+</div>
            <div className="text-sm text-muted-foreground">Impact Stories</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div>
            <div className="text-2xl font-bold text-accent">100+</div>
            <div className="text-sm text-muted-foreground">Photos Shared</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div>
            <div className="text-2xl font-bold text-accent">25+</div>
            <div className="text-sm text-muted-foreground">Villages Impacted</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;