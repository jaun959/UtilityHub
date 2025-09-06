
import React, { useState } from 'react';
import jsQR from 'jsqr';

const QrCodeScanner = () => {
  const [qrData, setQrData] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrData(code.data);
        } else {
          setQrData('No QR code found.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>
      <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="qr_image">Upload QR Code Image</label>
        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="qr_image" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {qrData && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">QR Code Data:</h3>
          <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">{qrData}</p>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;
