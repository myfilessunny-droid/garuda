import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, Clock, ArrowLeft } from 'lucide-react';

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

const StoriesPage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const storiesPerPage = 9;

  useEffect(() => {
    fetchStories();
  }, [currentPage, selectedCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('stories')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search term if provided
      let filteredStories = data || [];
      if (searchTerm) {
        filteredStories = filteredStories.filter(story =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (story.excerpt && story.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      setStories(filteredStories);
      setTotalPages(Math.ceil(filteredStories.length / storiesPerPage));
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStories();
  };

  const handleStoryClick = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'temple', label: 'Temple Restoration' },
    { value: 'women', label: 'Women Empowerment' },
    { value: 'goshala', label: 'Goshala Management' },
    { value: 'education', label: 'Education' },
    { value: 'community', label: 'Community Development' },
    { value: 'sustainability', label: 'Sustainability' }
  ];

  const getCurrentStories = () => {
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;
    return stories.slice(startIndex, endIndex);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ivory to-sandalwood/20 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Stories from the Ground
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the real impact of our work through the voices of communities, volunteers, and beneficiaries.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : getCurrentStories().length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  No stories found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all categories.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getCurrentStories().map((story) => (
                    <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {story.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={story.featured_image_url}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {story.category}
                          </Badge>
                          {story.is_featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-3 line-clamp-2">
                          {story.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {story.excerpt || 'Read our latest story from the ground...'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {story.author_name && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{story.author_name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(story.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{story.read_time_minutes || 5} min</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => handleStoryClick(story.id)}
                        >
                          Read Full Story
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StoriesPage; 