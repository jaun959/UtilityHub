import React from 'react';
import ToolCard from '../components/ToolCard.jsx';
import LinkShortener from '../components/LinkShortener.jsx';
import QrCodeGenerator from '../components/QrCodeGenerator.jsx';
import QrCodeScanner from '../components/QrCodeScanner.jsx';
import WebsiteScreenshotGenerator from '../components/WebsiteScreenshotGenerator.jsx';
import FaviconExtractor from '../components/FaviconExtractor.jsx';
import UrlRedirectChecker from '../components/UrlRedirectChecker.jsx';
import SeoTools from '../components/SeoTools.jsx';
import JsonXmlConverter from '../components/JsonXmlConverter.jsx';
import PasswordStrengthChecker from '../components/PasswordStrengthChecker.jsx';

const WebToolsPage = () => {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Web Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard title="Link Shortener" description="Shorten long URLs for easier sharing.">
          <LinkShortener />
        </ToolCard>
        <ToolCard title="QR Code Generator" description="Create QR codes from text or URLs.">
          <QrCodeGenerator />
        </ToolCard>
        <ToolCard title="QR Code Scanner" description="Scan QR codes using your device's camera.">
          <QrCodeScanner />
        </ToolCard>
        <ToolCard title="Website Screenshot Generator" description="Capture a full-page screenshot of any website.">
          <WebsiteScreenshotGenerator />
        </ToolCard>
        <ToolCard title="Favicon Extractor" description="Extract favicons from any website.">
          <FaviconExtractor />
        </ToolCard>
        <ToolCard title="URL Redirect Checker" description="Trace URL redirect chains.">
          <UrlRedirectChecker />
        </ToolCard>
        <ToolCard title="Robots.txt / Sitemap.xml Viewer" description="View and validate robots.txt and sitemap.xml files.">
          <SeoTools />
        </ToolCard>
        <ToolCard title="JSON <-> XML Converter" description="Convert between JSON and XML data formats, essential for web service integration and API data transformation.">
          <JsonXmlConverter />
        </ToolCard>
        <ToolCard title="Password Strength Checker" description="Analyze the strength of your password.">
          <PasswordStrengthChecker />
        </ToolCard>
      </div>
    </main>
  );
};

export default WebToolsPage;