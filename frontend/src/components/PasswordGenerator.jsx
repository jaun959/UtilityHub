
import React, { useState } from 'react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{};:,.<>?';

    if (charset === '') {
      setPassword('Please select at least one option.');
      return;
    }

    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Password Generator</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password Length:</label>
        <input
          type="number"
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          min="4"
          max="32"
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} />
          <span className="ml-2 text-gray-900 dark:text-white">Include Uppercase Letters</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} />
          <span className="ml-2 text-gray-900 dark:text-white">Include Lowercase Letters</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
          <span className="ml-2 text-gray-900 dark:text-white">Include Numbers</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
          <span className="ml-2 text-gray-900 dark:text-white">Include Symbols</span>
        </label>
      </div>
      <button onClick={generatePassword} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generate Password</button>

      {password && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Password:</h3>
          <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">{password}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
