import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfPageDeleter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
      setModifiedPdfBytes(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setNumPages(pdfDoc.getPageCount());
      } catch (err) {
        setError('Failed to load PDF. Please ensure it is a valid PDF file.');
        setNumPages(0);
      }
    } else {
      setPdfFile(null);
      setNumPages(0);
      setError('Please upload a valid PDF file.');
    }
  };

  const handleDeletePages = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    setError('');
    setModifiedPdfBytes(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pagesToDeleteArray = pagesToDelete
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .flatMap((range) => {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            if (isNaN(start) || isNaN(end) || start < 1 || end > numPages || start > end) {
              throw new Error(`Invalid page range: ${range}`);
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
          } else {
            const pageNum = Number(range);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > numPages) {
              throw new Error(`Invalid page number: ${range}`);
            }
            return [pageNum];
          }
        });

      pagesToDeleteArray.sort((a, b) => b - a);

      const pagesToDeleteSet = new Set(pagesToDeleteArray);
      const pagesToKeep = [];
      for (let i = 0; i < numPages; i++) {
        if (!pagesToDeleteSet.has(i + 1)) {
          pagesToKeep.push(i);
        }
      }

      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToKeep);
      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      const modifiedBytes = await newPdfDoc.save();
      setModifiedPdfBytes(modifiedBytes);
    } catch (err) {
      setError(`Error deleting pages: ${err.message}`);
    }
  };

  const handleDownload = () => {
    if (modifiedPdfBytes) {
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">PDF Page Deleter</h2>
      <div className="mb-4">
        <label htmlFor="pdfUpload" className="block text-gray-700 text-sm font-bold mb-2">
          Upload PDF:
        </label>
        <input
          type="file"
          id="pdfUpload"
          accept=".pdf"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {pdfFile && numPages > 0 && (
        <div className="mb-4">
          <p className="text-gray-700">Total pages: {numPages}</p>
          <label htmlFor="pagesToDelete" className="block text-gray-700 text-sm font-bold mb-2 mt-2">
            Pages to Delete (e.g., 1, 3, 5-7):
          </label>
          <input
            type="text"
            id="pagesToDelete"
            value={pagesToDelete}
            onChange={(e) => setPagesToDelete(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 1, 3, 5-7"
          />
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleDeletePages}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={!pdfFile || pagesToDelete.trim() === ''}
      >
        Delete Pages
      </button>

      {modifiedPdfBytes && (
        <div className="mt-4">
          <p className="text-green-600 mb-2">Pages deleted successfully!</p>
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Download Modified PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfPageDeleter;
