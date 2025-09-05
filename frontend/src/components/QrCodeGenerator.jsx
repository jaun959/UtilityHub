
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QrCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const generateQrCode = () => {
    setQrValue(text);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter text or link..."
          value={text}
          onChange={handleChange}
        />
      </div>
      <button onClick={generateQrCode} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generate QR Code</button>

      {qrValue && (
        <div className="mt-4 flex justify-center">
          <QRCodeSVG value={qrValue} size={256} level="H" />
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
