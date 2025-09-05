
import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvToJsonConverter = () => {
  const [csvInput, setCsvInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [convertedOutput, setConvertedOutput] = useState('');

  const handleCsvChange = (e) => {
    setCsvInput(e.target.value);
    setJsonInput('');
    setConvertedOutput('');
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    setCsvInput('');
    setConvertedOutput('');
  };

  const convertCsvToJson = () => {
    Papa.parse(csvInput, {
      header: true,
      complete: (results) => {
        setConvertedOutput(JSON.stringify(results.data, null, 2));
      },
      error: (err) => {
        setConvertedOutput(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  const convertJsonToCsv = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const csv = Papa.unparse(jsonData);
      setConvertedOutput(csv);
    } catch (e) {
      setConvertedOutput(`Error parsing JSON: ${e.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">CSV &lt;-&gt; JSON Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">CSV Input</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter CSV here..."
            value={csvInput}
            onChange={handleCsvChange}
          ></textarea>
          <button onClick={convertCsvToJson} className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">CSV to JSON</button>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">JSON Input</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter JSON here..."
            value={jsonInput}
            onChange={handleJsonChange}
          ></textarea>
          <button onClick={convertJsonToCsv} className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">JSON to CSV</button>
        </div>
      </div>

      {convertedOutput && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Output:</h3>
          <textarea
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="10"
            readOnly
            value={convertedOutput}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default CsvToJsonConverter;
