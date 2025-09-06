
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import * as domToImage from 'dom-to-image';

const QrCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const qrCodeRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const generateQrCode = () => {
    setLoading(true);
    setTimeout(() => {
      setQrValue(text);
      setLoading(false);
    }, 500);
  };

  const downloadPng = () => {
    if (qrCodeRef.current) {
      domToImage.toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'qrcode.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
  };

  const downloadPdf = () => {
    if (qrCodeRef.current) {
      domToImage.toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const pdf = new jsPDF({ unit: 'mm', format: [100, 100] });
          const imgData = dataUrl;
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          const margin = 10;
          const imgDisplayWidth = pdfWidth - 2 * margin;
          const imgDisplayHeight = (imgProps.height * imgDisplayWidth) / imgProps.width;

          const x = margin;
          const y = (pdfHeight - imgDisplayHeight) / 2;

          pdf.addImage(imgData, 'PNG', x, y, imgDisplayWidth, imgDisplayHeight);
          pdf.save('qrcode.pdf');
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
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
      <button onClick={generateQrCode} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>{loading ? 'Generating...' : 'Generate QR Code'}</button>

      {qrValue && (
        <div className="mt-4 flex flex-col items-center">
          <div ref={qrCodeRef} className="mb-4">
            <QRCodeSVG value={qrValue} size={256} level="H" />
          </div>
          <div className="flex space-x-4">
            <button onClick={downloadPng} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Download PNG</button>
            <button onClick={downloadPdf} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
