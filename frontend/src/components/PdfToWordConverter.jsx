import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PdfToWordConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/pdf-to-word', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedFile(res.data);
      toast.success('PDF converted to Word successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error converting PDF to Word. Please try again.');
    };
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">PDF to Word Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="single_file">Upload a PDF file</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="single_file" type="file" onChange={onFileChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert to Word</button>
      </form>

      {convertedFile && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted File:</h3>
          <p>{convertedFile.message}</p>
          {convertedFile.path && convertedFile.path !== 'placeholder.docx' && (
            <a href={convertedFile.path} download className="text-blue-500 hover:underline">Download Word</a>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfToWordConverter;