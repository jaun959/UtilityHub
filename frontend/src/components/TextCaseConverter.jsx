
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const TextCaseConverter = () => {
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const toUpperCase = () => {
    setConvertedText(text.toUpperCase());
  };

  const toLowerCase = () => {
    setConvertedText(text.toLowerCase());
  };

  const toTitleCase = () => {
    setConvertedText(text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Text Case Converter</h2>
      <div className="mb-4">
        <textarea
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
          rows="5"
          placeholder="Enter text here..."
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <button onClick={toUpperCase} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">UPPERCASE</button>
        <button onClick={toLowerCase} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">lowercase</button>
        <button onClick={toTitleCase} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Title Case</button>
      </div>
      {convertedText && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Text:
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
            value={convertedText}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default TextCaseConverter;
