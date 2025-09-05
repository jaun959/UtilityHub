
import React, { useState } from 'react';
import axios from 'axios';

const PdfSplitter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ranges, setRanges] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onRangeChange = (e) => {
    setRanges(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('ranges', ranges);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/split-pdf', formData, {
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
      <h2 className="text-2xl font-bold mb-4">PDF Splitter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="single_file">Upload a PDF file</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="single_file" type="file" onChange={onFileChange} /* Re-applied styling */ />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="ranges">Page Ranges (e.g. 1, 3-5, 8)</label>
          <input type="text" id="ranges" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1, 3-5, 8" value={ranges} onChange={onRangeChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Split PDF</button>
      </form>

      {convertedFile && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Split File:</h3>
          <a href={convertedFile.path} download className="text-blue-500 hover:underline">Download Split PDF</a>
        </div>
      )}
    </div>
  );
};

export default PdfSplitter;
