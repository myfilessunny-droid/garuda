import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import FileUpload from './FileUpload';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string;
  status: string;
  author_name: string;
  author_role: string;
  read_time_minutes: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

const StoriesManager = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    status: 'draft',
    author_name: '',
    author_role: '',
    read_time_minutes: 5,
    is_featured: false
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      toast.error('Failed to fetch stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const adminSession = localStorage.getItem('admin_session');
      const adminUser = adminSession ? JSON.parse(adminSession) : null;

      const storyData = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      if (editingStory) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', editingStory.id);

        if (error) throw error;
        toast.success('Story updated successfully');
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([{ ...storyData, created_by: adminUser?.id }]);

        if (error) throw error;
        toast.success('Story created successfully');
      }

      setShowForm(false);
      setEditingStory(null);
      resetForm();
      fetchStories();
    } catch (error) {
      toast.error('Failed to save story');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Story deleted successfully');
      fetchStories();
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      category: '',
      status: 'draft',
      author_name: '',
      author_role: '',
      read_time_minutes: 5,
      is_featured: false
    });
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      excerpt: story.excerpt || '',
      content: story.content,
      featured_image_url: story.featured_image_url || '',
      category: story.category,
      status: story.status,
      author_name: story.author_name || '',
      author_role: story.author_role || '',
      read_time_minutes: story.read_time_minutes || 5,
      is_featured: story.is_featured || false
    });
    setShowForm(true);
  };

  const categories = [
    { value: 'impact_story', label: 'Impact Story' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'news', label: 'News' },
    { value: 'testimonial', label: 'Testimonial' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Stories & Blog Management</h2>
          <p className="text-muted-foreground">Create and manage impact stories, blog posts, and news</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingStory(null);
            resetForm();
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingStory ? 'Edit Story' : 'Create New Story'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Story Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary or excerpt"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full story content"
                  rows={8}
                  required
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <FileUpload
                  bucket="story"
                  onUploadComplete={(url) => setFormData({ ...formData, featured_image_url: url })}
                  currentUrl={formData.featured_image_url}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author's name"
                  />
                </div>
                <div>
                  <Label htmlFor="author_role">Author Role</Label>
                  <Input
                    id="author_role"
                    value={formData.author_role}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                    placeholder="Author's role or title"
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    value={formData.read_time_minutes}
                    onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) || 5 })}
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured Story</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingStory ? 'Update' : 'Create')} Story
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingStory(null);
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
        {stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{story.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      story.status === 'published' ? 'bg-green-100 text-green-800' :
                      story.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {story.status}
                    </span>
                    {story.is_featured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{story.excerpt}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span> {categories.find(c => c.value === story.category)?.label}
                    </div>
                    <div>
                      <span className="font-medium">Author:</span> {story.author_name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Read Time:</span> {story.read_time_minutes} min
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(story.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(story)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(story.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoriesManager;