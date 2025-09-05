import React from 'react';
import ToolCard from '../components/ToolCard.jsx';
import PngToJpgConverter from '../components/PngToJpgConverter.jsx';
import ImageToPdfConverter from '../components/ImageToPdfConverter.jsx';
import ImageResizer from '../components/ImageResizer.jsx';
import ImageCompressor from '../components/ImageCompressor.jsx';
import ImageFormatConverter from '../components/ImageFormatConverter.jsx';
import Base64ImageConverter from '../components/Base64ImageConverter.jsx';

const ImageToolsPage = () => {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Image Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard title="Image Format Converter" description="Convert images between various formats (JPG, PNG, WebP, TIFF).">
          <ImageFormatConverter />
        </ToolCard>
        <ToolCard title="Image Compressor" description="Reduce the file size of your images.">
          <ImageCompressor />
        </ToolCard>
        <ToolCard title="Image Resizer" description="Change the dimensions of your images.">
          <ImageResizer />
        </ToolCard>
        <ToolCard title="Image to PDF Converter" description="Combine multiple images into a single PDF document.">
          <ImageToPdfConverter />
        </ToolCard>
        <ToolCard title="PNG to JPG Converter" description="Quickly convert PNG images to JPG format.">
          <PngToJpgConverter />
        </ToolCard>
        <ToolCard title="Base64 Image Converter" description="Encode or decode images to/from Base64 strings.">
          <Base64ImageConverter />
        </ToolCard>
      </div>
    </main>
  );
};

export default ImageToolsPage;