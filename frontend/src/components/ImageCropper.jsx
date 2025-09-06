import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImageSrc, setCroppedImageSrc] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setImageSrc(null);
      setCroppedImageSrc(null);
      setError('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image file (e.g., JPEG, PNG, GIF).');
      setImageSrc(null);
      setCroppedImageSrc(null);
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
      setImageSrc(null);
      setCroppedImageSrc(null);
      e.target.value = '';
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setCroppedImageSrc(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!imageSrc) {
      toast.error('Please upload an image first.');
      return;
    }

    setLoading(true);
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const cropX = image.naturalWidth * 0.25;
    const cropY = image.naturalHeight * 0.25;
    const cropWidth = image.naturalWidth * 0.5;
    const cropHeight = image.naturalHeight * 0.5;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    setCroppedImageSrc(canvas.toDataURL(image.type));
    toast.success('Image cropped successfully!');
    setLoading(false);
  };

  const handleDownloadCroppedImage = () => {
    if (croppedImageSrc) {
      const link = document.createElement('a');
      link.href = croppedImageSrc;
      link.download = `cropped-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Cropped image downloaded!');
    } else {
      toast.info('No cropped image to download.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Image Cropper</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 text-black" htmlFor="image_file">Upload Image</label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          id="image_file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

      </div>

      {imageSrc && (
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Original Image Preview</h3>
          <img ref={imageRef} src={imageSrc} alt="Original" className="max-w-full h-auto border rounded-md mb-4" />
          <button
            onClick={handleCrop}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? 'Cropping...' : 'Crop Image (Center 50%)'}
          </button>
        </div>
      )}

      {croppedImageSrc && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Cropped Image Preview</h3>
          <img src={croppedImageSrc} alt="Cropped" className="max-w-full h-auto border rounded-md mb-4" />
          <button
            onClick={handleDownloadCroppedImage}
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-800"
          >
            Download Cropped Image
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default ImageCropper;