import Tesseract from 'tesseract.js';

export const parseReceipt = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m)
    });
    
    // Extract amount (look for currency symbols and numbers)
    const amountMatch = text.match(/(?:USD|EUR|GBP|INR|\$|€|£|₹)\s*(\d+\.?\d*)/i) || text.match(/(\d+\.\d{2})/);
    const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[0]) : null;
    
    // Extract date (common formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
    const dateStr = dateMatch ? dateMatch[0] : new Date().toISOString();
    
    // Extract merchant name (usually first line or near "receipt")
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const merchant = lines[0]?.trim() || 'Unknown Merchant';
    
    // Extract category hints
    const lowerText = text.toLowerCase();
    let category = 'General';
    if (lowerText.includes('restaurant') || lowerText.includes('cafe') || lowerText.includes('food')) {
      category = 'Food & Dining';
    } else if (lowerText.includes('hotel') || lowerText.includes('accommodation')) {
      category = 'Lodging';
    } else if (lowerText.includes('taxi') || lowerText.includes('uber') || lowerText.includes('transport')) {
      category = 'Transportation';
    }
    
    return {
      merchant,
      amount,
      date: dateStr,
      category,
      notes: `OCR extracted from receipt. Raw text: ${text.substring(0, 200)}...`,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      merchant: 'OCR Failed',
      amount: null,
      date: new Date().toISOString(),
      category: 'General',
      notes: 'OCR processing failed. Please enter details manually.',
    };
  }
};
