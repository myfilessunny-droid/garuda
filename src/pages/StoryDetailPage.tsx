import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

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

const StoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id]);

  const fetchStory = async (storyId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setStory(data);
    } catch (error) {
      console.error('Failed to fetch story:', error);
      setError('Story not found or not published');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title || 'Story from Garuda Dhruvam',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-20 py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-20 py-16 text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Story Not Found</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={() => navigate('/stories')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <article className="max-w-4xl mx-auto px-6 lg:px-20 py-16">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/stories')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>

          {/* Featured Image */}
          {story.featured_image_url && (
            <div className="mb-8">
              <img
                src={story.featured_image_url}
                alt={story.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Story Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">
                {story.category}
              </Badge>
              {story.is_featured && (
                <Badge variant="default">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {story.title}
            </h1>
            
            {story.excerpt && (
              <p className="text-lg text-muted-foreground mb-6">
                {story.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              {story.author_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{story.author_name}</span>
                  {story.author_role && (
                    <span className="text-xs">({story.author_role})</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(story.published_at)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{story.read_time_minutes || 5} min read</span>
              </div>
            </div>

            {/* Share Button */}
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Story
            </Button>
          </header>

          {/* Story Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-gradient-to-r from-ivory to-sandalwood/20 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Inspired by this story?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join us in making a difference. Every contribution helps us continue our work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/donate')}>
                Support Our Work
              </Button>
              <Button variant="outline" onClick={() => navigate('/volunteer')}>
                Become a Volunteer
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetailPage; 