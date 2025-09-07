import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageToBase64Converter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 10 * 1024 * 1024;

    if (file && file.type.startsWith('image/')) {
      if (file.size > maxFileSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        setSelectedFile(null);
        e.target.value = null;
      } else {
        setSelectedFile(file);
        setBase64String('');
      }
    } else {
      setSelectedFile(null);
      setBase64String('');
      toast.error('Please select an image file.');
      e.target.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/convert/image-to-base64`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setBase64String(res.data.base64);
      toast.success('Image converted to Base64 successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error converting image to Base64. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64String);
    toast.success('Copied to clipboard!');
  };

  const downloadAsTxt = () => {
    const blob = new Blob([base64String], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-base64-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Base64 string downloaded as TXT!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image to Base64 Converter</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="image_file">Upload Image</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="image_file" type="file" onChange={onFileChange} accept="image/*" />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>{loading ? 'Converting...' : 'Convert to Base64'}</button>
      </form>

      {base64String && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Base64 String:
            <button onClick={copyToClipboard} className="ml-2 text-sm text-blue-500 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
            <button onClick={downloadAsTxt} className="ml-2 text-sm text-blue-500 hover:underline">
              Download TXT
            </button>
          </h3>
          <textarea
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm dark:border-gray-600 h-max"
            rows="10"
            readOnly
            value={base64String}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default ImageToBase64Converter;