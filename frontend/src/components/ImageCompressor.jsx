
import React, { useState } from 'react';
import axios from 'axios';

const ImageCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/avif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only images (JPEG, PNG, GIF, WebP, TIFF, AVIF) are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
    if (validFiles.length !== files.length) {
      e.target.value = ''; // Clear the input if some files were invalid
    } else {
      setError(''); // Clear error if all files are valid
    }
  };

  const onQualityChange = (e) => {
    setQuality(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    formData.append('quality', quality);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/compress-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image Compressor</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="multiple_files">Upload multiple image files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="quality">Quality (1-100%)</label>
          <input type="number" id="quality" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80" value={quality} onChange={onQualityChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Compress Images</button>
      </form>

      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Compressed Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {convertedFiles.map((file, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow">
                <img src={file.path} alt={file.originalname} className="w-full h-auto" />
                <a href={`http://localhost:5000/api/convert/download-image/${file.originalname}`} download={file.originalname} className="text-blue-500 hover:underline">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
