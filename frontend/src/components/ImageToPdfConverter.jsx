
import React, { useState } from 'react';
import axios from 'axios';

const ImageToPdfConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFile, setConvertedFile] = useState(null);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/convert/image-to-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedFile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image to PDF Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="multiple_files">Upload multiple files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert</button>
      </form>

      {convertedFile && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted File:</h3>
          <a href={`${convertedFile}`} download={convertedFile.originalname} className="text-blue-500 hover:underline">Download PDF</a>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfConverter;
