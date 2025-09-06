import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageGrayscaler = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      toast.error('Please select an image file.');
      e.target.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/convert/image-grayscale`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { path, originalname } = res.data;

      const link = document.createElement('a');
      link.href = path;
      link.setAttribute('download', originalname);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      toast.success('Image converted to grayscale and downloaded successfully!');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error converting image to grayscale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image Grayscaler</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image_file">Upload Image</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="image_file" type="file" onChange={onFileChange} accept="image/*" />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>{loading ? 'Converting...' : 'Convert to Grayscale'}</button>
      </form>
    </div>
  );
};

export default ImageGrayscaler;