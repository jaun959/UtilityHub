
import React, { useState } from 'react';
import axios from 'axios';

const Base64ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [convertedResult, setConvertedResult] = useState(null);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onBase64StringChange = (e) => {
    setBase64String(e.target.value);
  };

  const encodeImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('type', 'encode');

    try {
      const res = await axios.post('http://localhost:5000/api/convert/base64-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedResult({ type: 'encoded', data: res.data.base64 });
    } catch (err) {
      console.error(err);
    }
  };

  const decodeImage = async () => {
    if (!base64String) return;

    try {
      const res = await axios.post('http://localhost:5000/api/convert/base64-image', { type: 'decode', base64String });
      setConvertedResult({ type: 'decoded', data: res.data.path });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Base64 Image Encoder/Decoder</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="image_file">Upload Image to Encode</label>
        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="image_file" type="file" onChange={onFileChange} />
        <button onClick={encodeImage} className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Encode Image</button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="base64_string">Enter Base64 String to Decode</label>
        <textarea
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="5"
          placeholder="Enter Base64 string..."
          value={base64String}
          onChange={onBase64StringChange}
        ></textarea>
        <button onClick={decodeImage} className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Decode Base64</button>
      </div>

      {convertedResult && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          {convertedResult.type === 'encoded' ? (
            <textarea readOnly className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="5" value={convertedResult.data}></textarea>
          ) : (
            <a href={convertedResult.data} download={`decoded-image-${Date.now()}.png`} className="text-blue-500 hover:underline">Download Decoded Image</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Base64ImageConverter;
