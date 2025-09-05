import React from 'react';
import ToolCard from '../components/ToolCard.jsx';
import LinkShortener from '../components/LinkShortener.jsx';
import QrCodeGenerator from '../components/QrCodeGenerator.jsx';
import QrCodeScanner from '../components/QrCodeScanner.jsx';

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
      </div>
    </main>
  );
};

export default WebToolsPage;