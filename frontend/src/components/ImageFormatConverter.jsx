
import React, { useState } from 'react';
import axios from 'axios';

const ImageFormatConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [format, setFormat] = useState('jpeg');
  const [convertedFiles, setConvertedFiles] = useState([]);

  const onFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const onFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    formData.append('format', format);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/convert-image-format', formData, {
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
      <h2 className="text-2xl font-bold mb-4">Image Format Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="multiple_files">Upload image files (any format)</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" type="file" multiple onChange={onFileChange} /* Re-applied styling */ />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="format">Target Format</label>
          <select id="format" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={format} onChange={onFormatChange}>
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert Format</button>
      </form>

      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Images:</h3>
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

export default ImageFormatConverter;
