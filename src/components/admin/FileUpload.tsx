import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image } from "lucide-react";

interface FileUploadProps {
  bucket: string;
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  accept?: string;
}

const FileUpload = ({ 
  bucket, 
  onUploadComplete, 
  currentUrl,
  accept = "image/*"
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('You must be logged in to upload files');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading to bucket:', bucket);
      console.log('File path:', filePath);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to upload file: ${errorMessage}`);
      
      // Provide specific guidance for common errors
      if (errorMessage.includes('row-level security policy')) {
        toast.error('Storage permissions issue. Please contact administrator.');
      } else if (errorMessage.includes('not logged in')) {
        toast.error('Please log in again to upload files.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Process the file directly instead of creating a fake event
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        
        setIsUploading(true);
        
        try {
          // Check if user is authenticated
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            throw new Error('You must be logged in to upload files');
          }

          // Create unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${fileName}`;

          console.log('Uploading to bucket:', bucket);
          console.log('File path:', filePath);

          // Upload file to Supabase Storage
          const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(uploadError.message);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;
          setPreviewUrl(publicUrl);
          onUploadComplete(publicUrl);
          toast.success('File uploaded successfully');
        } catch (error) {
          console.error('Upload error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast.error(`Failed to upload file: ${errorMessage}`);
          
          // Provide specific guidance for common errors
          if (errorMessage.includes('row-level security policy')) {
            toast.error('Storage permissions issue. Please contact administrator.');
          } else if (errorMessage.includes('not logged in')) {
            toast.error('Please log in again to upload files.');
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop an image, or click to select
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Select Image'}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, GIF (max 5MB)
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              const { data, error } = await supabase.storage
                .from(bucket)
                .list('', { limit: 1 });
              
              if (error) {
                console.error('Bucket access test failed:', error);
                toast.error(`Cannot access ${bucket} bucket: ${error.message}`);
              } else {
                console.log(`✅ ${bucket} bucket accessible`);
                toast.success(`${bucket} bucket is accessible`);
              }
            } catch (error) {
              console.error('Bucket test error:', error);
              toast.error(`Bucket test failed: ${error}`);
            }
          }}
        >
          Test Bucket
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;