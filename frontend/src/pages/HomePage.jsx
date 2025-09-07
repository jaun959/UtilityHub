import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const categories = [
    {
      title: 'Image Tools',
      description: 'Your go-to suite for all image manipulation needs. Convert between various formats (JPG, PNG, WebP, TIFF, AVIF), compress images to save space without losing quality, resize photos for web or print, combine multiple images into a single PDF document, quickly convert PNG to JPG, crop images to a specific area, convert to grayscale, flip horizontally or vertically, and convert images to Base64 strings.',
      link: '/images',
      tools: ['Image Converter', 'Image Compressor', 'Image Resizer', 'Image to PDF', 'PNG to JPG', 'Image Cropper', 'Image Grayscaler', 'Image Flipper', 'Image to Base64'],
    },
    {
      title: 'PDF Tools',
      description: 'Comprehensive tools for managing your PDF documents. Merge multiple PDFs into one, split large PDFs into smaller files, compress PDF file size, protect PDFs with passwords, remove PDF passwords, convert PDF to text, rotate PDF pages, and generate PDFs from plain text.',
      link: '/pdfs',
      tools: ['PDF Merger', 'PDF Splitter', 'PDF Compressor', 'PDF Password Protector', 'PDF Password Remover', 'PDF to Text', 'PDF Rotator', 'Text to PDF'],
    },
    {
      title: 'Text Tools',
      description: 'A versatile collection of text utilities. Easily convert text to different cases (uppercase, lowercase, title case), compare two texts to find differences, encode/decode text to/from Base64, convert between HTML and Markdown, validate and format JSON data, generate various cryptographic hashes, create strong, random, and customizable passwords, and convert CSV data to JSON format.',
      link: '/text',
      tools: ['Text Case Converter', 'Text Difference Checker', 'Base64 Converter', 'HTML/Markdown Converter', 'JSON Formatter', 'Hash Generator', 'Password Generator', 'CSV to JSON'],
    },
    {
      title: 'Web Tools',
      description: 'Essential tools for web-related tasks. Shorten long URLs for easier sharing and tracking, generate custom QR codes for text or links, scan QR codes from uploaded images, capture full-page screenshots of any website, extract favicons, trace and analyze URL redirect chains, view and validate robots.txt and sitemap.xml files for SEO analysis, convert between JSON and XML data formats, and analyze the strength of your password.',
      link: '/web',
      tools: ['URL Shortener', 'QR Code Generator', 'QR Code Scanner', 'Website Screenshot', 'Favicon Extractor', 'URL Redirect Checker', 'Robots.txt/Sitemap Viewer', 'JSON <-> XML Converter', 'Password Strength Checker'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Utility Hub - Your One-Stop Solution for Everyday Tools</title>
        <meta name="description" content="Utility Hub provides a comprehensive suite of free online tools for image, PDF, text, and web manipulation. Convert image formats, compress images, resize photos, merge and split PDFs, protect PDFs with passwords, convert text to PDF, extract text from PDFs, rotate PDF pages, convert text cases, check text differences, encode/decode Base64, convert HTML to Markdown and vice-versa, format and validate JSON, generate hashes, create strong passwords, convert CSV to JSON, shorten URLs, generate and scan QR codes, capture website screenshots, extract favicons, check URL redirects, convert JSON to XML, and check password strength. Simplify your daily conversions and boost productivity with our versatile and user-friendly tools." />
        <meta name="keywords" content="utility hub, online tools, image tools, PDF tools, text tools, web tools, image converter, image compressor, image resizer, image to PDF, PNG to JPG, image cropper, image grayscaler, image flipper, image to Base64, PDF merger, PDF splitter, PDF compressor, PDF password protector, PDF to text, PDF rotator, text to PDF, text case converter, text difference checker, Base64 text converter, HTML to Markdown, Markdown to HTML, JSON formatter, JSON validator, hash generator, password generator, CSV to JSON, URL shortener, QR code generator, QR code scanner, website screenshot, favicon extractor, URL redirect checker, JSON to XML converter, password strength checker, free online tools, productivity tools, file conversion" />
        <meta property="og:title" content="Utility Hub - Your One-Stop Solution for Everyday Tools" />
        <meta property="og:description" content="Utility Hub provides a comprehensive suite of free online tools for image, PDF, text, and web manipulation. Convert image formats, compress images, resize photos, merge and split PDFs, protect PDFs with passwords, convert text to PDF, extract text from PDFs, rotate PDF pages, convert text cases, check text differences, encode/decode Base64, convert HTML to Markdown and vice-versa, format and validate JSON, generate hashes, create strong passwords, convert CSV to JSON, shorten URLs, generate and scan QR codes, capture website screenshots, extract favicons, check URL redirects, convert JSON to XML, and check password strength. Simplify your daily conversions and boost productivity with our versatile and user-friendly tools." />
        <meta property="og:image" content="https://dkutils.vercel.app/logo.png" />
        <meta property="og:url" content="https://dkutils.vercel.app/" />
      </Helmet>
      <main className="container mx-auto p-8">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-6 md:mb-8 leading-tight">Welcome to Utility Hub!</h2>
        <p className="text-lg md:text-xl text-center text-gray-700 mb-10 max-w-3xl mx-auto">Your one-stop solution for everyday utility conversions and tools. Simplify your tasks with our powerful and easy-to-use online utilities.</p>

        <p className="text-md text-center text-gray-500 mb-8">
          Note: For unauthenticated users, file uploads are limited to 10MB. Log in for an increased limit of 50MB.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="block">
              <div className="relative rounded-xl border border-gray-200 bg-white text-gray-900 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col justify-between p-6 transform hover:scale-105">
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
    </>
  );
};

export default HomePage;