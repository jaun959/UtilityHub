import ToolCard from '../components/ToolCard.jsx';
import PdfMerger from '../components/PdfMerger.jsx';
import PdfSplitter from '../components/PdfSplitter.jsx';
import PdfToImageConverter from '../components/PdfToImageConverter.jsx';
import PdfToWordConverter from '../components/PdfToWordConverter.jsx';
import PdfToExcelConverter from '../components/PdfToExcelConverter.jsx';
import TextToPdfGenerator from '../components/TextToPdfGenerator.jsx';
import ExcelToPdfConverter from '../components/ExcelToPdfConverter.jsx';

const PdfToolsPage = () => {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">PDF Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard title="PDF Merger" description="Combine multiple PDF documents into one.">
          <PdfMerger />
        </ToolCard>
        <ToolCard title="PDF Splitter" description="Split a PDF document into multiple pages or ranges.">
          <PdfSplitter />
        </ToolCard>
        <ToolCard title="PDF to Image Converter" description="Convert PDF pages into image files.">
          <PdfToImageConverter />
        </ToolCard>
        <ToolCard title="PDF to Word Converter" description="Convert PDF documents to editable Word files.">
          <PdfToWordConverter />
        </ToolCard>
        <ToolCard title="PDF to Excel Converter" description="Convert PDF tables into Excel spreadsheets.">
          <PdfToExcelConverter />
        </ToolCard>
        <ToolCard title="Text to PDF Generator" description="Convert plain text into a PDF document.">
          <TextToPdfGenerator />
        </ToolCard>
        <ToolCard title="Excel to PDF Converter" description="Convert Excel spreadsheets to PDF format.">
          <ExcelToPdfConverter />
        </ToolCard>
      </div>
    </main>
  );
};

export default PdfToolsPage;