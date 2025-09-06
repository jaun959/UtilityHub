
import React, { useState } from 'react';

const Base64TextConverter = () => {
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const encodeBase64 = () => {
    setConvertedText(btoa(text));
  };

  const decodeBase64 = () => {
    try {
      setConvertedText(atob(text));
    } catch (e) {
      setConvertedText('Invalid Base64 string');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Base64 Text Encoder/Decoder</h2>
      <div className="mb-4">
        <textarea
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="5"
          placeholder="Enter text or Base64 string..."
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <button onClick={encodeBase64} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Encode Base64</button>
        <button onClick={decodeBase64} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Decode Base64</button>
      </div>
      {convertedText && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Text:</h3>
          <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">{convertedText}</p>
        </div>
      )}
    </div>
  );
};

export default Base64TextConverter;
