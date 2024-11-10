import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}

export function ImageUpload({ label, id, value, onChange, onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setError(null);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="h-32 w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor={id}
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id={id}
                    name={id}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {isUploading && (
          <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
        )}
      </div>
    </div>
  );
}