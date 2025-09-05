import React from 'react';
import ToolCard from '../components/ToolCard.jsx';
import TextCaseConverter from '../components/TextCaseConverter.jsx';
import TextDifferenceChecker from '../components/TextDifferenceChecker.jsx';
import Base64TextConverter from '../components/Base64TextConverter.jsx';
import HtmlToMarkdownConverter from '../components/HtmlToMarkdownConverter.jsx';
import MarkdownToHtmlConverter from '../components/MarkdownToHtmlConverter.jsx';
import JsonFormatterValidator from '../components/JsonFormatterValidator.jsx';
import HashGenerator from '../components/HashGenerator.jsx';
import PasswordGenerator from '../components/PasswordGenerator.jsx';

const TextToolsPage = () => {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Text Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard title="Text Case Converter" description="Convert text to various case formats (e.g., uppercase, lowercase, title case).">
          <TextCaseConverter />
        </ToolCard>
        <ToolCard title="Text Difference Checker" description="Compare two texts and highlight the differences.">
          <TextDifferenceChecker />
        </ToolCard>
        <ToolCard title="Base64 Text Converter" description="Encode or decode text to/from Base64.">
          <Base64TextConverter />
        </ToolCard>
        <ToolCard title="HTML to Markdown Converter" description="Convert HTML content to Markdown format.">
          <HtmlToMarkdownConverter />
        </ToolCard>
        <ToolCard title="Markdown to HTML Converter" description="Convert Markdown content to HTML format.">
          <MarkdownToHtmlConverter />
        </ToolCard>
        <ToolCard title="JSON Formatter/Validator" description="Format and validate JSON data.">
          <JsonFormatterValidator />
        </ToolCard>
        <ToolCard title="Hash Generator" description="Generate various cryptographic hashes (e.g., MD5, SHA1, SHA256).">
          <HashGenerator />
        </ToolCard>
        <ToolCard title="Password Generator" description="Generate strong, random passwords.">
          <PasswordGenerator />
        </ToolCard>
      </div>
    </main>
  );
};

export default TextToolsPage;