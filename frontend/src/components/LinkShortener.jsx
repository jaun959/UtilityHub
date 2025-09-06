
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LinkShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const onChange = (e) => {
    setOriginalUrl(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shorten`, { originalUrl });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error shortening URL. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Link Shortener</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter URL"
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={originalUrl}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Shorten</button>
      </form>

      {shortUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Shortened URL:</h3>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{shortUrl}</a>
        </div>
      )}
    </div>
  );
};

export default LinkShortener;
