# PA Real Estate Support Services

## Transaction Form & Airtable Integration

This document provides an overview of the transaction form submission process and Airtable integration.

### Setup

1. Environment Variables
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_AIRTABLE_API_KEY=your_api_key
     VITE_AIRTABLE_BASE_ID=your_base_id
     ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Start Development Server
   ```bash
   npm run dev
   ```

### Form Submission Process

1. Agent fills out the transaction form with:
   - Property data (MLS number, address)
   - Client information
   - Commission details
   - Required documents

2. Form validation ensures:
   - All required fields are filled
   - Data formats are correct
   - Property data is valid

3. Submission process:
   - Data is validated client-side
   - Form data is formatted for Airtable
   - Submission is processed with retry mechanism
   - Success/error feedback is provided to user

### Airtable Integration

1. Data Structure
   - Transactions table stores main transaction data
   - Clients are linked to transactions
   - Documents are tracked but stored in Dotloop/Docusign

2. Field Mappings
   - MLS Number → `mlsNumber`
   - Property Address → `propertyAddress`
   - Sale Price → `salePrice`
   - Commission → `commissionAmount`

3. Error Handling
   - Failed submissions are logged
   - Retry mechanism for temporary failures
   - User-friendly error messages

### Development

1. Running Tests
   ```bash
   npm test
   ```

2. Building for Production
   ```bash
   npm run build
   ```

### Troubleshooting

1. Form Submission Issues
   - Check browser console for detailed error messages
   - Verify all required fields are filled
   - Ensure Airtable API key is valid

2. Integration Issues
   - Verify environment variables
   - Check Airtable base permissions
   - Review field mappings in code

### Support

For technical support or questions about the integration, please contact the development team.