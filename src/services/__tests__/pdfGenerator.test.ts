import { PDFGenerator } from '../pdfGenerator';

describe('PDFGenerator', () => {
  it('should successfully create a test PDF', async () => {
    const result = await PDFGenerator.testPDFGeneration();
    expect(result).toBe(true);
  });
}); 