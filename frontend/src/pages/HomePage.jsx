import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const categories = [
    {
      title: 'Image Tools',
      description: 'Your go-to suite for all image manipulation needs. Convert between formats like JPG, PNG, WebP, and TIFF. Compress images to save space without losing quality. Resize photos for web or print, and even convert multiple images into a single PDF document. Includes specialized tools for Base64 encoding/decoding and quick PNG to JPG conversion.',
      link: '/images',
    },
    {
      title: 'PDF Tools',
      description: 'Comprehensive tools for managing your PDF documents. Merge multiple PDFs into one, split large PDFs into smaller files, or convert PDF pages into high-quality images. Seamlessly transform PDFs into editable Word or Excel documents, and convert Word or Excel files back into PDFs. Also includes a simple text-to-PDF generator.',
      link: '/pdfs',
    },
    {
      title: 'Text Tools',
      description: 'A versatile collection of text utilities. Easily convert text to different cases (uppercase, lowercase, title case). Compare two texts to find differences, encode/decode text to/from Base64, and convert between HTML and Markdown. Validate and format JSON data, generate strong passwords, and create various cryptographic hashes.',
      link: '/text',
    },
    {
      title: 'Web Tools',
      description: 'Essential tools for web-related tasks. Shorten long URLs for easy sharing and tracking. Generate custom QR codes for text or links, and use our scanner to quickly read QR codes from images.',
      link: '/web',
    },
  ];

  return (
    <main className="container mx-auto p-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Welcome to Utility Hub!</h2>
      <p className="text-xl text-center text-gray-600 mb-12">Your one-stop solution for everyday utility conversions and tools.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <Link to={category.link} key={index} className={`block ${index === 0 ? 'lg:col-span-3' : ''}`}>
            <div className="relative rounded-xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col justify-between p-6">
              <div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 mb-3">{category.title}</h3>
                <p className="text-sm text-muted-foreground text-gray-700">{category.description}</p>
              </div>
              <div className="mt-6 text-right">
                <span className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                  Explore <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default HomePage;