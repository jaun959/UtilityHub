import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PdfToTextConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setExtractedText('');
    } else {
      setSelectedFile(null);
      setExtractedText('');
      toast.error('Please select a PDF file.');
      e.target.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/pdf-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExtractedText(res.data);
      toast.success('Text extracted successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error extracting text from PDF.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">PDF to Text Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="pdf_file">Upload PDF</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="pdf_file" type="file" onChange={onFileChange} accept=".pdf" />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Extract Text</button>
      </form>

      {extractedText && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Extracted Text:
            <button onClick={copyToClipboard} className="ml-2 text-sm text-blue-500 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </h3>
          <textarea
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm dark:border-gray-600 h-max"
            rows="10"
            readOnly
            value={extractedText}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default PdfToTextConverter;