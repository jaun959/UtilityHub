
import React, { useState } from 'react';

const JsonFormatterValidator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setFormattedJson('');
    setValidationMessage('');
  };

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsedJson, null, 2));
      setValidationMessage('Valid JSON');
    } catch (e) {
      setFormattedJson('');
      setValidationMessage(`Invalid JSON: ${e.message}`);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonInput);
      setValidationMessage('Valid JSON');
    } catch (e) {
      setValidationMessage(`Invalid JSON: ${e.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">JSON Formatter & Validator</h2>
      <div className="mb-4">
        <textarea
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="10"
          placeholder="Enter JSON here..."
          value={jsonInput}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <button onClick={formatJson} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Format JSON</button>
        <button onClick={validateJson} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Validate JSON</button>
      </div>

      {validationMessage && (
        <div className={`mt-4 p-3 rounded-md ${validationMessage.startsWith('Valid') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {validationMessage}
        </div>
      )}

      {formattedJson && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Formatted JSON:</h3>
          <textarea
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm dark:bg-gray-700 dark:border-gray-600"
            rows="10"
            readOnly
            value={formattedJson}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default JsonFormatterValidator;
