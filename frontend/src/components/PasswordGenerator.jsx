
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    setLoading(true);
    setTimeout(() => {
      let charset = '';
      let newPassword = '';

      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{};:,.<>?';

      if (charset === '') {
        setPassword('Please select at least one option.');
        setLoading(false);
        return;
      }

      for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      setPassword(newPassword);
      setLoading(false);
    }, 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Password Generator</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 text-black">Password Length:</label>
        <input
          type="number"
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          min="4"
          max="32"
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} />
          <span className="ml-2 text-gray-900 text-black">Include Uppercase Letters</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} />
          <span className="ml-2 text-gray-900 text-black">Include Lowercase Letters</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
          <span className="ml-2 text-gray-900 text-black">Include Numbers</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
          <span className="ml-2 text-gray-900 text-black">Include Symbols</span>
        </label>
      </div>
      <button onClick={generatePassword} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>{loading ? 'Generating...' : 'Generate Password'}</button>

      {password && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Password:
            <button onClick={copyToClipboard} className="ml-2 text-sm text-blue-500 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </h3>
          <textarea
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm dark:border-gray-600 h-max"
            rows="1"
            readOnly
            value={password}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
