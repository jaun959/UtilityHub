
import React, { useState } from 'react';
import { marked } from 'marked';

const MarkdownToHtmlConverter = () => {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
    setHtml(marked(e.target.value));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Markdown to HTML Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">Markdown Input</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter Markdown here..."
            value={markdown}
            onChange={handleMarkdownChange}
          ></textarea>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">HTML Output</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            readOnly
            value={html}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default MarkdownToHtmlConverter;
