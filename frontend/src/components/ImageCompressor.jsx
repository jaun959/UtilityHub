
import React, { useState } from 'react';
import axios from 'axios';

const ImageCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [convertedFiles, setConvertedFiles] = useState([]);

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
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
          <div className="flex items-center justify-center w-full">
            <label htmlFor="multiple_files" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="multiple_files" type="file" className="hidden" multiple onChange={onFileChange} />
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="quality">Quality (1-100%)</label>
          <input type="number" id="quality" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="80" value={quality} onChange={onQualityChange} />
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
                <a href={file.path} download={file.originalname} className="text-blue-500 hover:underline">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
