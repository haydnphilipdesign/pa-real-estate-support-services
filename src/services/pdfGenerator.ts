import { TransactionFormData } from '../components/TransactionForm/types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';

const ADMIN_EMAIL = 'debbie@parealestatesupport.com';

export class PDFGenerator {
  private static async createHeader(page: any, text: string) {
    const { width, height } = page.getSize();
    const fontSize = 24;

    // Add logo placeholder (you can replace this with actual logo)
    page.drawRectangle({
      x: 50,
      y: height - 120,
      width: 60,
      height: 60,
      color: rgb(0.9, 0.9, 0.9)
    });

    // Add header text
    page.drawText(text, {
      x: 130,
      y: height - 80,
      size: fontSize,
      font: await page.doc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(0.1, 0.1, 0.1)
    });

    // Add decorative line
    page.drawLine({
      start: { x: 50, y: height - 130 },
      end: { x: width - 50, y: height - 130 },
      thickness: 2,
      color: rgb(0.1, 0.4, 0.8)
    });
  }

  private static async createSection(
    page: any,
    title: string,
    content: string,
    yPosition: number,
    options: { isHighlighted?: boolean } = {}
  ) {
    const titleFont = await page.doc.embedFont(StandardFonts.HelveticaBold);
    const contentFont = await page.doc.embedFont(StandardFonts.Helvetica);
    const { width } = page.getSize();

    // Add section background if highlighted
    if (options.isHighlighted) {
      page.drawRectangle({
        x: 40,
        y: yPosition - 100,
        width: width - 80,
        height: 90,
        color: rgb(0.95, 0.95, 1)
      });
    }

    // Add section title with accent bar
    page.drawRectangle({
      x: 40,
      y: yPosition,
      width: 4,
      height: 20,
      color: rgb(0.1, 0.4, 0.8)
    });

    page.drawText(title, {
      x: 50,
      y: yPosition,
      size: 14,
      font: titleFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    // Draw content
    const contentLines = this.wrapText(content, 80);
    contentLines.forEach((line, index) => {
      page.drawText(line, {
        x: 50,
        y: yPosition - 20 - (index * 15),
        size: 11,
        font: contentFont,
        color: rgb(0.3, 0.3, 0.3)
      });
    });

    return yPosition - (20 + (contentLines.length * 15)) - 20;
  }

  private static wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  public static async generatePDF(formData: TransactionFormData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard US Letter size

    // Add header
    await this.createHeader(page, 'Transaction Details Report');

    let currentY = page.getHeight() - 160;

    // Transaction Summary (highlighted section)
    currentY = await this.createSection(page, 'Transaction Summary', `
      Property: ${formData.propertyAddress}
      MLS Number: ${formData.mlsNumber}
      Sale Price: $${formData.salePrice}
      Agent Role: ${formData.role}
      Status: ${formData.propertyStatus}
    `, currentY, { isHighlighted: true });

    // Client Information
    const clientInfo = formData.clients?.map((client, index) => `
      Client ${index + 1}:
      • Name: ${client.name}
      • Email: ${client.email}
      • Phone: ${client.phone}
      • Marital Status: ${client.maritalStatus}
      • Address: ${client.address || 'Not provided'}
    `).join('\n\n') || 'No clients';

    currentY = await this.createSection(page, 'Client Information', clientInfo, currentY);

    // Commission Details
    currentY = await this.createSection(page, 'Commission Information', `
      Base: ${formData.commissionBase}
      Total Commission: $${formData.totalCommission}
      Listing Agent: ${formData.listingAgentCommission}%
      Buyer's Agent: ${formData.buyersAgentCommission}%
      ${formData.referralParty ? `Referral Party: ${formData.referralParty}` : ''}
      ${formData.referralFee ? `Referral Fee: ${formData.referralFee}` : ''}
    `, currentY);

    // Property Details
    currentY = await this.createSection(page, 'Property Details', `
      Status: ${formData.propertyStatus}
      Winterized: ${formData.winterizedStatus}
      Access: ${formData.accessType}
      HOA: ${formData.hoa || 'N/A'}
      Municipality/Township: ${formData.municipalityTownship}
      First Right of Refusal: ${formData.firstRightOfRefusal ? 'Yes' : 'No'}
      ${formData.firstRightOfRefusalName ? `First Right Party: ${formData.firstRightOfRefusalName}` : ''}
    `, currentY);

    // Warranty Information
    if (formData.homeWarrantyPurchased) {
      currentY = await this.createSection(page, 'Warranty Information', `
        Company: ${formData.homeWarrantyCompany}
        Cost: $${formData.warrantyCost}
        Paid By: ${formData.warrantyPaidBy}
      `, currentY);
    }

    // Title Company
    currentY = await this.createSection(page, 'Title Company Information', `
      Company: ${formData.titleCompany}
      Fee Paid By: ${formData.tcFeePaidBy}
    `, currentY);

    // Special Instructions
    if (formData.specialInstructions || formData.urgentIssues) {
      currentY = await this.createSection(page, 'Special Instructions & Notes', `
        ${formData.specialInstructions ? `Instructions: ${formData.specialInstructions}` : ''}
        ${formData.urgentIssues ? `Urgent Issues: ${formData.urgentIssues}` : ''}
      `, currentY);
    }

    // Add footer
    const dateStr = format(new Date(), 'MM/dd/yyyy');
    page.drawText(`Generated on ${dateStr}`, {
      x: 50,
      y: 30,
      size: 10,
      color: rgb(0.5, 0.5, 0.5)
    });

    page.drawText('CONFIDENTIAL', {
      x: page.getWidth() / 2 - 30,
      y: 30,
      size: 10,
      color: rgb(0.5, 0.5, 0.5)
    });

    page.drawText('Page 1 of 1', {
      x: page.getWidth() - 100,
      y: 30,
      size: 10,
      color: rgb(0.5, 0.5, 0.5)
    });

    return pdfDoc.save();
  }

  public static async generateAndEmail(formData: TransactionFormData): Promise<void> {
    try {
      const pdfBytes = await this.generatePDF(formData);
      
      // Convert Uint8Array to base64 string
      const pdfBase64 = await this.uint8ArrayToBase64(pdfBytes);

      // Send to your backend API
      const response = await fetch('/api/email-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64,
          emailAddress: ADMIN_EMAIL,
          subject: `Transaction Details - ${formData.mlsNumber || 'New Transaction'}`,
          message: `New transaction form submission for property: ${formData.propertyAddress}.
            
Agent Name: ${formData.agentName}
MLS Number: ${formData.mlsNumber}
Submission Date: ${new Date().toLocaleString()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error generating or sending PDF:', error);
      throw error;
    }
  }

  private static async uint8ArrayToBase64(bytes: Uint8Array): Promise<string> {
    // Create a blob from the Uint8Array
    const blob = new Blob([bytes], { type: 'application/pdf' });
    
    // Convert blob to base64 using FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (data:application/pdf;base64,)
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert PDF to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public static async testPDFGeneration(): Promise<boolean> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText('PDF Generation Test', {
        x: 50,
        y: 750,
        size: 24,
        font,
        color: rgb(0, 0, 0),
      });

      await pdfDoc.save();
      return true;
    } catch (error) {
      console.error('PDF Generation Test Failed:', error);
      return false;
    }
  }
} 