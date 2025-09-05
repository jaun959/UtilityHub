
import React, { useState } from 'react';
import TurndownService from 'turndown';

const HtmlToMarkdownConverter = () => {
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');

  const turndownService = new TurndownService();

  const handleHtmlChange = (e) => {
    setHtml(e.target.value);
    setMarkdown(turndownService.turndown(e.target.value));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">HTML to Markdown Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">HTML Input</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Enter HTML here..."
            value={html}
            onChange={handleHtmlChange}
          ></textarea>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black">Markdown Output</label>
          <textarea
            className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            readOnly
            value={markdown}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default HtmlToMarkdownConverter;
