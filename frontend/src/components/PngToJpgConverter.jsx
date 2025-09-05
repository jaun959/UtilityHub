
import React, { useState } from 'react';
import axios from 'axios';

const PngToJpgConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/convert/png-to-jpg', formData, {
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
      <h2 className="text-2xl font-bold mb-4">PNG to JPG Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">Upload multiple files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert</button>
      </form>

      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Files:</h3>
          <ul>
            {convertedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.path} download={file.originalname} className="text-blue-500 hover:underline">{file.originalname}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PngToJpgConverter;
