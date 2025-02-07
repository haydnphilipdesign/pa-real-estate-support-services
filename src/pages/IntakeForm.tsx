import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, User, MapPin, Calendar, DollarSign, Home, Clock, 
  MessageSquare, CheckCircle, AlertCircle, Briefcase 
} from 'lucide-react';
import PageHero from '../components/PageHero';
import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

interface FormErrors {
  [key: string]: string | undefined;
}

const IntakeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // Agent Role
    role: '',

    // Client Information
    mlsNumber: '',
    propertyAddress: '',
    salePrice: '',
    clientNames: '',
    clientCurrentAddress: '',
    primaryEmail: '',
    secondaryEmail: '',
    primaryPhone: '',
    secondaryPhone: '',
    maritalStatus: '',

    // Commission Structure
    commissionBase: '',
    totalCommission: '',
    totalCommissionPercentage: '',
    listingAgentCommission: '',
    buyersAgentCommission: '',
    buyerPaidCommission: '',
    buyerPaidCommissionPercentage: '',
    referralParty: '',
    brokerEIN: '',
    referralFee: '',

    // Transaction Details
    resaleCertRequired: '',
    coRequired: '',
    firstRightOfRefusal: '',
    attorneyName: '',
    homeWarrantyCompany: '',
    warrantyCost: '',
    warrantyPaidBy: '',
    titleCompany: '',
    tcFeePaidBy: '',
    propertyStatus: '',
    accessInformation: '',
    accessCode: '',
    updateMLS: false,

    // Additional Notes
    additionalNotes: '',

    // Confirmation
    agentSignature: '',
    signatureDate: '',

    errors: {} as FormErrors
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      errors: {
        ...prev.errors,
        [name]: undefined
      }
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Submit to Airtable
      await base('Transaction Intake').create([
        {
          fields: {
            // Agent Role
            'Agent Role': formData.role,

            // Client Information
            'MLS Number': formData.mlsNumber,
            'Property Address': formData.propertyAddress,
            'Sale Price': formData.salePrice,
            'Client Names': formData.clientNames,
            'Client Current Address': formData.clientCurrentAddress,
            'Primary Email': formData.primaryEmail,
            'Secondary Email': formData.secondaryEmail,
            'Primary Phone': formData.primaryPhone,
            'Secondary Phone': formData.secondaryPhone,
            'Marital Status': formData.maritalStatus,

            // Commission Structure
            'Commission Base': formData.commissionBase,
            'Total Commission': formData.totalCommission,
            'Total Commission Percentage': formData.totalCommissionPercentage,
            'Listing Agent Commission': formData.listingAgentCommission,
            'Buyers Agent Commission': formData.buyersAgentCommission,
            'Buyer Paid Commission': formData.buyerPaidCommission,
            'Buyer Paid Commission Percentage': formData.buyerPaidCommissionPercentage,
            'Referral Party': formData.referralParty,
            'Broker EIN': formData.brokerEIN,
            'Referral Fee': formData.referralFee,

            // Transaction Details
            'Resale Cert Required': formData.resaleCertRequired,
            'CO Required': formData.coRequired,
            'First Right of Refusal': formData.firstRightOfRefusal,
            'Attorney Name': formData.attorneyName,
            'Home Warranty Company': formData.homeWarrantyCompany,
            'Warranty Cost': formData.warrantyCost,
            'Warranty Paid By': formData.warrantyPaidBy,
            'Title Company': formData.titleCompany,
            'TC Fee Paid By': formData.tcFeePaidBy,
            'Property Status': formData.propertyStatus,
            'Access Information': formData.accessInformation,
            'Access Code': formData.accessCode,
            'Update MLS': formData.updateMLS,

            // Additional Notes
            'Additional Notes': formData.additionalNotes,

            // Confirmation
            'Agent Signature': formData.agentSignature,
            'Signature Date': formData.signatureDate,

            // Metadata
            'Status': 'Pending Review',
            'Submission Date': new Date().toISOString()
          }
        }
      ]);

      setSubmitStatus('success');
      // Reset form
      setFormData({
        role: '',
        mlsNumber: '',
        propertyAddress: '',
        salePrice: '',
        clientNames: '',
        clientCurrentAddress: '',
        primaryEmail: '',
        secondaryEmail: '',
        primaryPhone: '',
        secondaryPhone: '',
        maritalStatus: '',
        commissionBase: '',
        totalCommission: '',
        totalCommissionPercentage: '',
        listingAgentCommission: '',
        buyersAgentCommission: '',
        buyerPaidCommission: '',
        buyerPaidCommissionPercentage: '',
        referralParty: '',
        brokerEIN: '',
        referralFee: '',
        resaleCertRequired: '',
        coRequired: '',
        firstRightOfRefusal: '',
        attorneyName: '',
        homeWarrantyCompany: '',
        warrantyCost: '',
        warrantyPaidBy: '',
        titleCompany: '',
        tcFeePaidBy: '',
        propertyStatus: '',
        accessInformation: '',
        accessCode: '',
        updateMLS: false,
        additionalNotes: '',
        agentSignature: '',
        signatureDate: '',
        errors: {}
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit form. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Transaction Intake Form"
        subtitle="Please complete all required fields"
        backgroundImage="/notebook2.jpg"
        height="small"
        overlay="gradient"
        overlayOpacity={0.7}
      />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          {submitStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Transaction Details Submitted!</h4>
              <p className="text-gray-600">We'll review your submission and get back to you soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Agent Role Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <Briefcase className="mr-3 text-brand-gold" /> Agent Role
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {['Buyer\'s Agent', 'Listing Agent', 'Dual Agent'].map((role) => (
                    <label key={role} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="form-radio text-brand-blue focus:ring-brand-gold"
                      />
                      <span className="text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Client Information Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <User className="mr-3 text-brand-gold" /> Client Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="mlsNumber"
                    placeholder="MLS Number (if applicable)"
                    value={formData.mlsNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                  <input
                    type="text"
                    name="propertyAddress"
                    placeholder="Property Address *"
                    required
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                  {/* Add remaining client information fields */}
                </div>
              </div>

              {/* 3. Commission Structure Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <DollarSign className="mr-3 text-brand-gold" /> Commission Structure
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Add commission structure fields */}
                </div>
              </div>

              {/* 4. Transaction Details Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <MapPin className="mr-3 text-brand-gold" /> Transaction Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Add transaction details fields */}
                </div>
              </div>

              {/* 5. Additional Notes Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <MessageSquare className="mr-3 text-brand-gold" /> Additional Notes
                </h2>
                <textarea
                  name="additionalNotes"
                  placeholder="Critical Dates/Deadlines, Special Conditions, Known Issues/Concerns, etc."
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                />
              </div>

              {/* 6. Confirmation Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-semibold text-brand-blue mb-6 flex items-center">
                  <CheckCircle className="mr-3 text-brand-gold" /> Confirmation
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="agentSignature"
                    placeholder="Agent Signature (Type Full Name) *"
                    required
                    value={formData.agentSignature}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                  <input
                    type="date"
                    name="signatureDate"
                    required
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-blue text-white px-12 py-4 rounded-xl hover:bg-brand-gold transition-colors duration-300 flex items-center justify-center mx-auto gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText /> Submit Transaction Details
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default IntakeForm; 