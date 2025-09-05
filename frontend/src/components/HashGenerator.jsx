
import React, { useState } from 'react';

const HashGenerator = () => {
  const [text, setText] = useState('');
  const [hashMd5, setHashMd5] = useState('');
  const [hashSha256, setHashSha256] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    setHashMd5('');
    setHashSha256('');
  };

  const generateHash = async (algorithm) => {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(text);

    let hashBuffer;
    if (algorithm === 'MD5') {
      // MD5 is not directly supported by Web Crypto API for security reasons.
      // For demonstration, we'll use a simple non-cryptographic hash or note this limitation.
      // In a real app, you'd use a library or backend for MD5.
      setHashMd5('MD5 not directly supported by Web Crypto API. Use a library or backend.');
      return;
    } else if (algorithm === 'SHA-256') {
      hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashSha256(hexHash);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Hash Generator</h2>
      <div className="mb-4">
        <textarea
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="5"
          placeholder="Enter text here..."
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <button onClick={() => generateHash('MD5')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generate MD5</button>
        <button onClick={() => generateHash('SHA-256')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generate SHA256</button>
      </div>

      {hashMd5 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">MD5 Hash:</h3>
          <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">{hashMd5}</p>
        </div>
      )}

      {hashSha256 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">SHA256 Hash:</h3>
          <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">{hashSha256}</p>
        </div>
      )}
    </div>
  );
};

export default HashGenerator;
