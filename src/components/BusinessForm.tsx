import React, { useEffect } from 'react';
import type { BusinessInfo } from '../types/business';

interface BusinessFormProps {
  onSubmit: (info: BusinessInfo) => void;
  isGenerating: boolean;
}

export function BusinessForm({ onSubmit, isGenerating }: BusinessFormProps) {
  useEffect(() => {
    // Parse URL parameters on component mount
    const params = new URLSearchParams(window.location.search);
    const description = params.get('description');
    
    if (description) {
      // Find form elements and set their values
      const form = document.querySelector('form');
      if (form) {
        const descriptionField = form.querySelector('#description') as HTMLTextAreaElement;
        if (descriptionField) {
          descriptionField.value = decodeURIComponent(description);
        }

        // Extract business name from description if present
        const nameMatch = description.match(/Business Name: (.*?)(?:\n|$)/);
        if (nameMatch) {
          const nameField = form.querySelector('#name') as HTMLInputElement;
          if (nameField) {
            nameField.value = nameMatch[1].trim();
          }
        }

        // Extract address from description if present
        const addressMatch = description.match(/Address: (.*?)(?:\n|$)/);
        if (addressMatch) {
          const addressField = form.querySelector('#address') as HTMLInputElement;
          if (addressField) {
            addressField.value = addressMatch[1].trim();
          }
        }

        // Extract phone from description if present
        const phoneMatch = description.match(/Phone: (.*?)(?:\n|$)/);
        if (phoneMatch) {
          const phoneField = form.querySelector('#phone') as HTMLInputElement;
          if (phoneField) {
            phoneField.value = phoneMatch[1].trim();
          }
        }

        // Clear URL parameters after filling the form
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const info: BusinessInfo = {
      name: formData.get('name') as string || 'Business Name',
      description: formData.get('description') as string,
      address: formData.get('address') as string || '',
      phone: formData.get('phone') as string || '',
      backgroundUrl: formData.get('backgroundUrl') as string || 'https://images.unsplash.com/photo-1557683316-973673baf926',
      logoUrl: formData.get('logoUrl') as string || '',
    };
    
    onSubmit(info);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Business Description/ANYINFO
          <span className="ml-1 text-sm text-gray-500">
            (Include all business details, image URLs, and any other information here)
          </span>
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={8}
          placeholder={`Enter all relevant information here, for example:

Business Name: Acme Corp
Industry: Technology
Description: Leading provider of innovative solutions
Key Services:
- Web Development
- Mobile Apps
- Cloud Solutions

Images:
- Header: https://images.unsplash.com/photo-xxx
- Logo: https://company.com/logo.png

Contact:
Address: 123 Tech Street, Silicon Valley
Phone: (555) 123-4567
Email: info@acme.com

Additional Details:
- Founded: 2020
- Team Size: 50+
- Service Area: Global`}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        <details className="group">
          <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            <span>Optional Details</span>
            <svg className="ml-2 h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="backgroundUrl" className="block text-sm font-medium text-gray-700">
                Background Image URL
              </label>
              <input
                type="url"
                name="backgroundUrl"
                id="backgroundUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                id="logoUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </details>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>
    </form>
  );
}