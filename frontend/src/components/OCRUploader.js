import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRUploader = ({ onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // Extract amount
      const amountMatch = text.match(/(?:USD|EUR|GBP|INR|\$|€|£|₹)\s*(\d+\.?\d*)/i) || text.match(/(\d+\.\d{2})/);
      const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[0]) : null;

      // Extract date
      const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
      const date = dateMatch ? dateMatch[0] : null;

      // Extract category hints
      const lowerText = text.toLowerCase();
      let category = '';
      if (lowerText.includes('restaurant') || lowerText.includes('cafe') || lowerText.includes('food')) {
        category = 'Food & Dining';
      } else if (lowerText.includes('hotel') || lowerText.includes('accommodation')) {
        category = 'Lodging';
      } else if (lowerText.includes('taxi') || lowerText.includes('uber') || lowerText.includes('transport')) {
        category = 'Transportation';
      }

      const parsed = {
        amount,
        date,
        category,
        notes: `OCR extracted: ${text.substring(0, 100)}...`,
      };

      onParsed?.(parsed);
    } catch (error) {
      console.error('OCR Error:', error);
      alert('OCR failed. Please enter details manually.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium mb-1">Scan Receipt (OCR)</label>
      <input type="file" accept="image/*" onChange={handleChange} disabled={loading} className="w-full" />
      {loading && (
        <div className="mt-2">
          <div className="text-xs text-gray-600">Processing OCR... {progress}%</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">Upload receipt image to auto-fill fields using OCR</p>
    </div>
  );
};

export default OCRUploader;
