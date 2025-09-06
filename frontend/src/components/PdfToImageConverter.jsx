
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PdfToImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/api/convert/pdf-to-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedImages(res.data);
      toast.success('PDF converted to image successfully!');
    } catch (err) {
      console.error('Error during PDF to Image conversion:', err);
      toast.error(err.response?.data?.msg || 'Error converting PDF to image. Please try again.');
    };
  }
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">PDF to Image Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="single_file">Upload a PDF file</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="single_file" type="file" onChange={onFileChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert</button>
      </form>

      {convertedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {convertedImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.path} alt={`Converted page ${index + 1}`} className="w-full h-auto border border-gray-300 rounded-lg" />
                <a href={image.path} download={image.originalname} className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfToImageConverter;
