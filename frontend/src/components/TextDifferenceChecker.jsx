
import React, { useState } from 'react';
import { diff_match_patch } from 'diff-match-patch';

const TextDifferenceChecker = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState('');

  const handleText1Change = (e) => {
    setText1(e.target.value);
  };

  const handleText2Change = (e) => {
    setText2(e.target.value);
  };

  const compareTexts = () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diff);

    const html = diff.map((part) => {
      const [type, text] = part;
      if (type === 0) { // Common
        return text;
      } else if (type === 1) { // Added
        return `<span class="bg-green-200">${text}</span>`;
      } else if (type === -1) { // Deleted
        return `<span class="bg-red-200">${text}</span>`;
      }
      return '';
    }).join('');

    setDiffResult(html);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Text Difference Checker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">Text 1</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter first text..."
            value={text1}
            onChange={handleText1Change}
          ></textarea>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">Text 2</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter second text..."
            value={text2}
            onChange={handleText2Change}
          ></textarea>
        </div>
      </div>
      <button onClick={compareTexts} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Compare Texts</button>

      {diffResult && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Differences:</h3>
          <div
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            dangerouslySetInnerHTML={{ __html: diffResult }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TextDifferenceChecker;
