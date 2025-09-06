
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PdfMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFile, setConvertedFile] = useState(null);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 10 * 1024 * 1024;

    const validFiles = [];
    let hasError = false;

    files.forEach(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`Invalid file type: ${file.name}. Only PDF files are allowed.`);
        hasError = true;
        return;
      }
      if (file.size > maxFileSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        hasError = true;
        return;
      }
      validFiles.push(file);
    });

    setSelectedFiles(validFiles);
    if (hasError) {
      e.target.value = '';
      setError('Some files were not added due to size or type restrictions.');
    } else {
      setError('');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('pdfs', file);
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/convert/merge-pdfs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setConvertedFile(res.data);
      toast.success('PDFs merged successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error merging PDFs. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">PDF Merger</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="multiple_files">Upload multiple PDF files</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="multiple_files" type="file" multiple onChange={onFileChange} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Merge PDFs</button>
      </form>

      {convertedFile && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Merged File:</h3>
          <button onClick={() => window.open(convertedFile.path, '_blank')} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Download Merged PDF</button>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;