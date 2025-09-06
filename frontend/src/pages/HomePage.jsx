import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const categories = [
    {
      title: 'Image Tools',
      description: 'Your go-to suite for all image manipulation needs. Convert between formats like JPG, PNG, WebP, and TIFF. Compress images to save space without losing quality. Resize photos for web or print, and even convert multiple images into a single PDF document. Includes specialized tools for Base64 encoding/decoding and quick PNG to JPG conversion.',
      link: '/images',
      tools: ['Image Converter', 'Image Compressor', 'Image Resizer', 'PNG to JPG', 'Image to Base64'],
    },
    {
      title: 'PDF Tools',
      description: 'Comprehensive tools for managing your PDF documents. Merge multiple PDFs into one, split large PDFs into smaller files, or convert PDF pages into high-quality images. Seamlessly transform PDFs into editable Word or Excel documents, and convert Word or Excel files back into PDFs. Also includes a simple text-to-PDF generator.',
      link: '/pdfs',
      tools: ['PDF Merger', 'PDF Splitter', 'PDF to Word', 'PDF to Excel', 'PDF to Image', 'Text to PDF'],
    },
    {
      title: 'Text Tools',
      description: 'A versatile collection of text utilities. Easily convert text to different cases (uppercase, lowercase, title case). Compare two texts to find differences, encode/decode text to/from Base64, and convert between HTML and Markdown. Validate and format JSON data, generate strong passwords, and create various cryptographic hashes.',
      link: '/text',
      tools: ['Text Case Converter', 'Text Difference Checker', 'Base64 Converter', 'HTML/Markdown Converter', 'JSON Formatter', 'Password Generator'],
    },
    {
      title: 'Web Tools',
      description: 'Essential tools for web-related tasks. Shorten long URLs for easy sharing and tracking. Generate custom QR codes for text or links, and use our scanner to quickly read QR codes from images.',
      link: '/web',
      tools: ['URL Shortener', 'QR Code Generator', 'QR Code Scanner', 'Redirect Checker', 'Favicon Extractor'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Utility Hub - Your One-Stop Solution for Everyday Tools</title>
        <meta name="description" content="Utility Hub offers a comprehensive suite of online tools for image, PDF, text, and web-related tasks. Simplify your daily conversions and productivity needs."/>
        <meta property="og:title" content="Utility Hub - Your One-Stop Solution for Everyday Tools"/>
        <meta property="og:description" content="Utility Hub offers a comprehensive suite of online tools for image, PDF, text, and web-related tasks. Simplify your daily conversions and productivity needs."/>
        <meta property="og:image" content="/logo.png"/>
        <meta property="og:url" content={window.location.href}/>
      </Helmet>
      <main className="container mx-auto p-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Welcome to Utility Hub!</h2>
      <p className="text-xl text-center text-gray-600 mb-12">Your one-stop solution for everyday utility conversions and tools.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, index) => (
          <Link to={category.link} key={index} className="block">
            <div className="relative rounded-xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col justify-between p-6">
              <div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 mb-3">{category.title}</h3>
                <p className="text-sm text-muted-foreground text-gray-700 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {tool}
                    </span>
                  ))}
                </div>
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