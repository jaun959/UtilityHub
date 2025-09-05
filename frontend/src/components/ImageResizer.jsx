
import React, { useState } from 'react';
import axios from 'axios';

const ImageResizer = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [convertedFiles, setConvertedFiles] = useState([]);

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const onWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const onHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    formData.append('width', width);
    formData.append('height', height);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/resize-image', formData, {
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
      <h2 className="text-2xl font-bold mb-4">Image Resizer</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">Upload multiple image files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
        </div>
        <div className="mb-4 flex space-x-4">
          <input type="number" placeholder="Width" className="w-1/2 px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={width} onChange={onWidthChange} />
          <input type="number" placeholder="Height" className="w-1/2 px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={height} onChange={onHeightChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Resize Images</button>
      </form>

      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Resized Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {convertedFiles.map((file, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow">
                <img src={file.path} alt={file.originalname} className="w-full h-auto" />
                <a href={file.path} download={file.originalname} className="text-blue-500 hover:underline">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;
