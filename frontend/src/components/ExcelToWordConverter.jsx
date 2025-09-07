
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';

const ExcelToWordConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = isAuthenticated ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'csv') {
        if (file.size > maxFileSize) {
          toast.error(`File too large: ${file.name}. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`);
          setSelectedFile(null);
          e.target.value = null;
        } else {
          setSelectedFile(file);
        }
      } else {
        setSelectedFile(null);
        toast.error('Only .xlsx or .csv files are allowed.');
        e.target.value = '';
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('excel', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/convert/excel-to-word`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `converted-${Date.now()}.docx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('File converted to Word successfully!');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error converting file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Excel to Word Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="single_file">Upload an Excel or CSV file</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="single_file" type="file" onChange={onFileChange} accept=".xlsx,.csv" />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>
          {loading ? 'Converting...' : 'Convert to Word'}
        </button>
      </form>
    </div>
  );
};

export default ExcelToWordConverter;
