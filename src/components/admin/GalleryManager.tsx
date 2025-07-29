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

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  date_taken: string;
  photographer: string;
  is_featured: boolean;
  created_at: string;
}

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    location: '',
    date_taken: '',
    photographer: '',
    is_featured: false
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      toast.error('Failed to fetch gallery items');
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

      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Gallery item updated successfully');
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([{ ...formData, uploaded_by: adminUser?.id }]);

        if (error) throw error;
        toast.success('Gallery item created successfully');
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      toast.error('Failed to save gallery item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Gallery item deleted successfully');
      fetchGalleryItems();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      location: '',
      date_taken: '',
      photographer: '',
      is_featured: false
    });
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category,
      location: item.location || '',
      date_taken: item.date_taken || '',
      photographer: item.photographer || '',
      is_featured: item.is_featured || false
    });
    setShowForm(true);
  };

  const categories = [
    { value: 'temple', label: 'Temple' },
    { value: 'goshala', label: 'Goshala' },
    { value: 'women', label: 'Women Empowerment' },
    { value: 'children', label: 'Children' },
    { value: 'events', label: 'Events' },
    { value: 'training', label: 'Training' },
    { value: 'general', label: 'General' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Gallery Management</h2>
          <p className="text-muted-foreground">Upload and organize photos from your programs and events</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            resetForm();
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Photo' : 'Add New Photo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Photo Title *</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the photo"
                  rows={3}
                />
              </div>

              <div>
                <Label>Photo Upload *</Label>
                <FileUpload
                  bucket="gallery"
                  onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                  currentUrl={formData.image_url}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Photo location"
                  />
                </div>
                <div>
                  <Label htmlFor="date_taken">Date Taken</Label>
                  <Input
                    id="date_taken"
                    type="date"
                    value={formData.date_taken}
                    onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="photographer">Photographer</Label>
                  <Input
                    id="photographer"
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    placeholder="Photographer name"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Photo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingItem ? 'Update' : 'Add')} Photo
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              {item.is_featured && (
                <span className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  Featured
                </span>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div><span className="font-medium">Category:</span> {categories.find(c => c.value === item.category)?.label}</div>
                {item.location && <div><span className="font-medium">Location:</span> {item.location}</div>}
                {item.photographer && <div><span className="font-medium">Photographer:</span> {item.photographer}</div>}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;