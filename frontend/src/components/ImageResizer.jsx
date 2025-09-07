import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';

const ImageResizer = () => {
  const { state: { isAuthenticated } } = useContext(AuthContext);
  const [originalImage, setOriginalImage] = useState(null);
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  // eslint-disable-next-line no-unused-vars
  const [resizedImageSrc, setResizedImageSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = isAuthenticated ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

    if (!file) {
      setOriginalImage(null);
      setResizedImageSrc(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image file (e.g., JPEG, PNG, GIF).');
      setOriginalImage(null);
      setResizedImageSrc(null);
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File too large: ${file.name}. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      setOriginalImage(null);
      setResizedImageSrc(null);
      e.target.value = '';
      return;
    }
    setOriginalImage(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setNewWidth(img.width.toString());
        setNewHeight(img.height.toString());
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!originalImage) {
      toast.error('Please upload an image first.');
      return;
    }

    const width = parseInt(newWidth);
    const height = parseInt(newHeight);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      toast.error('Please enter valid positive numbers for width and height.');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(originalImage.type);
        setResizedImageSrc(dataUrl);
        toast.success('Image resized successfully! Starting download...');
        handleDownload(dataUrl, `resized-${originalImage ? originalImage.name : 'image'}`);
        setLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(originalImage);
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image Resizer</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-black" htmlFor="image_file">Upload Image</label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          id="image_file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

      </div>

      {originalImage && (
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Original Image</h3>
          <p className="text-sm text-gray-700 mb-2">
            Name: {originalImage.name} | Type: {originalImage.type} | Size: {(originalImage.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm text-gray-700 mb-4">
            Dimensions: {originalDimensions.width} x {originalDimensions.height} pixels
          </p>

          <div className="flex space-x-4 mb-4">
            <div>
              <label htmlFor="newWidth" className="block text-sm font-medium text-gray-700">New Width (px)</label>
              <input
                type="number"
                id="newWidth"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={newWidth}
                onChange={(e) => setNewWidth(e.target.value)}
                placeholder="e.g., 300"
              />
            </div>
            <div>
              <label htmlFor="newHeight" className="block text-sm font-medium text-gray-700">New Height (px)</label>
              <input
                type="number"
                id="newHeight"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
                placeholder="e.g., 200"
              />
            </div>
          </div>
          <button
            onClick={handleResize}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? 'Resizing...' : 'Resize Image'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;