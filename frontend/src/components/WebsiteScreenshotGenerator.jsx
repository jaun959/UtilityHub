import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WebsiteScreenshotGenerator = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/screenshot`, { url });
      const { path, originalname } = res.data;

      const link = document.createElement('a');
      link.href = path;
      link.setAttribute('download', originalname);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Screenshot ZIP generated and downloaded: ${originalname}`);
    } catch (err) {
      console.error('Error generating screenshot:', err);
      setError(err.response?.data?.msg || 'Failed to generate screenshot. Please check the URL and try again.');
      toast.error(err.response?.data?.msg || 'Failed to generate screenshot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Website Screenshot Generator</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="urlInput" className="block mb-2 text-sm font-medium text-gray-900">Website URL</label>
          <input
            type="url"
            id="urlInput"
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., https://www.example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Screenshot'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default WebsiteScreenshotGenerator;
