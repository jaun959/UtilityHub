
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PngToJpgConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedZipFile, setConvertedZipFile] = useState(null);

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/png'];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = [];
    let hasInvalidFile = false;

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only PNG images are allowed.`);
        hasInvalidFile = true;
        return;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        hasInvalidFile = true;
        return;
      }
      validFiles.push(file);
    });

    setSelectedFiles(validFiles);
    if (hasInvalidFile) {
      e.target.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/convert/png-to-jpg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedZipFile(res.data);
      toast.success('PNGs converted to JPG successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error converting PNG to JPG. Please try again.');
    };
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">PNG to JPG Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="multiple_files">Upload multiple files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Convert</button>
      </form>

      {convertedZipFile && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Converted Files (ZIP):</h3>
          <div className="bg-white p-2 rounded-lg shadow">
            <a href={convertedZipFile.path} download={convertedZipFile.originalname} className="text-blue-500 hover:underline">Download All Converted Images</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PngToJpgConverter;