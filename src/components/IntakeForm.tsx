import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type AgentRole = "Buyer's Agent" | "Listing Agent" | "Dual Agent";

interface FormData {
  agentRole: AgentRole;
  propertyAddress: string;
  mlsNumber?: string;
  salePrice: number;
  clientNames: string;
  clientAddress: string;
  primaryEmail: string;
  secondaryEmail?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  maritalStatus: string;
  commissionBase: string;
  totalCommission: number;
  totalCommissionPercentage?: number;
  listingAgentCommission?: number;
  buyersAgentCommission?: number;
  buyerPaidCommission?: number;
  buyerPaidCommissionPercentage?: number;
  referralParty?: string;
  brokerEIN?: string;
  referralFeePercentage?: number;
  resaleCertHOAName?: string;
  coTownship?: string;
  firstRightOfRefusal: string;
  attorneyName?: string;
  homeWarrantyCompany?: string;
  warrantyCost?: number;
  warrantyPaidBy?: string;
  titleCompany?: string;
  tcFeePaidBy: string;
  propertyStatus: string;
  accessInformation: string;
  accessCode?: string;
  updateMLS: boolean;
  requiredDocuments: string[];
  agentSignature: string;
  signatureDate: string;
}

const initialFormData: FormData = {
  agentRole: "Buyer's Agent" as AgentRole,
  propertyAddress: '',
  mlsNumber: '',
  salePrice: 0,
  clientNames: '',
  clientAddress: '',
  primaryEmail: '',
  primaryPhone: '',
  maritalStatus: 'Single',
  commissionBase: 'fullPrice',
  totalCommission: 0,
  tcFeePaidBy: 'Client',
  propertyStatus: 'Vacant',
  accessInformation: 'Electronic Lock Box',
  updateMLS: false,
  requiredDocuments: [],
  agentSignature: '',
  signatureDate: '',
  firstRightOfRefusal: '',
};

const IntakeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (doc: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: checked
        ? [...prev.requiredDocuments, doc]
        : prev.requiredDocuments.filter(d => d !== doc)
    }));
  };

  const shouldShowField = (roles: string) => {
    // roles can be 'B' (Buyer), 'S' (Seller), 'D' (Dual), or 'BS' (Both Buyer and Seller)
    switch (roles) {
      case 'B':
        return formData.agentRole === "Buyer's Agent";
      case 'S':
        return formData.agentRole === "Listing Agent";
      case 'D':
        return formData.agentRole === "Dual Agent";
      case 'BS':
        // Show for all agent types
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle form submission
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const buyerDocuments = [
    'Agreement of Sale & Addenda',
    'Attorney Review Clause',
    'KW Affiliate Services Disclosure',
    'Consumer Notice',
    'Buyer\'s Agency Contract',
    'Prequalification/Proof of Funds',
  ];

  const listingDocuments = [
    'Agreement of Sale and Addenda',
    'Buyer\'s Prequalification/Preapproval Letter/Proof of Funds',
    'Attorney Review Clause',
    'KW Affiliate Services Disclosure',
    'Seller\'s Property Disclosure',
    'Lead Based Paint Disclosure',
  ];

  const isBuyersAgent = () => formData.agentRole === "Buyer's Agent";
  const isListingAgent = () => formData.agentRole === "Listing Agent";
  const isDualAgent = () => formData.agentRole === "Dual Agent";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Intake Form</CardTitle>
          <p className="text-sm text-gray-500">Complete all required fields</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Role */}
          <div className="space-y-2">
            <Label>Agent Role *</Label>
            <RadioGroup
              value={formData.agentRole}
              onValueChange={(value) => handleSelectChange('agentRole', value as AgentRole)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Buyer's Agent" id="buyersAgent" />
                <Label htmlFor="buyersAgent">Buyer's Agent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Listing Agent" id="listingAgent" />
                <Label htmlFor="listingAgent">Listing Agent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Dual Agent" id="dualAgent" />
                <Label htmlFor="dualAgent">Dual Agent</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Property Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Information</h3>
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Address *</Label>
              <Input
                id="propertyAddress"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price (USD) *</Label>
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                value={formData.salePrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mlsNumber">MLS Number</Label>
              <Input
                id="mlsNumber"
                name="mlsNumber"
                value={formData.mlsNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            {isBuyersAgent() && (
              <div className="space-y-2">
                <Label>Buyer's Agent Required Documents</Label>
                <div className="space-y-2">
                  {buyerDocuments.map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={formData.requiredDocuments.includes(doc)}
                        onCheckedChange={(checked) => handleCheckboxChange(doc, checked as boolean)}
                      />
                      <Label htmlFor={doc}>{doc}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isListingAgent() && (
              <div className="space-y-2">
                <Label>Listing Agent Required Documents</Label>
                <div className="space-y-2">
                  {listingDocuments.map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={formData.requiredDocuments.includes(doc)}
                        onCheckedChange={(checked) => handleCheckboxChange(doc, checked as boolean)}
                      />
                      <Label htmlFor={doc}>{doc}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Client Information */}
          {shouldShowField('BS') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Client Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="clientNames">Client Name(s) *</Label>
                <Input
                  id="clientNames"
                  name="clientNames"
                  value={formData.clientNames}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address *</Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Client's Marital Status *</Label>
                <Select 
                  value={formData.maritalStatus} 
                  onValueChange={(value) => handleSelectChange('maritalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Widow/Widower">Widow/Widower</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Divorce in Process">Divorce in Process</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Phone *</Label>
                  <Input
                    id="primaryPhone"
                    name="primaryPhone"
                    type="tel"
                    value={formData.primaryPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    id="secondaryPhone"
                    name="secondaryPhone"
                    type="tel"
                    value={formData.secondaryPhone || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryEmail">Primary Email *</Label>
                  <Input
                    id="primaryEmail"
                    name="primaryEmail"
                    type="email"
                    value={formData.primaryEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryEmail">Secondary Email</Label>
                  <Input
                    id="secondaryEmail"
                    name="secondaryEmail"
                    type="email"
                    value={formData.secondaryEmail || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Commission Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Commission Structure</h3>
            
            {shouldShowField('BS') && (
              <div className="space-y-2">
                <Label>Commission Base *</Label>
                <RadioGroup
                  value={formData.commissionBase}
                  onValueChange={value => handleSelectChange('commissionBase', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sale Price" id="salePrice" />
                    <Label htmlFor="salePrice">Sale Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Net Proceeds (After Seller's Assistance)" id="netProceeds" />
                    <Label htmlFor="netProceeds">Net Proceeds (After Seller's Assistance)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {shouldShowField('BS') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalCommission">Total Commission ($) *</Label>
                  <Input
                    id="totalCommission"
                    name="totalCommission"
                    type="number"
                    step="0.01"
                    value={formData.totalCommission}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCommissionPercentage">Total Commission (%)</Label>
                  <Input
                    id="totalCommissionPercentage"
                    name="totalCommissionPercentage"
                    type="number"
                    step="0.01"
                    value={formData.totalCommissionPercentage || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {shouldShowField('S') && (
              <div className="space-y-2">
                <Label htmlFor="listingAgentCommission">Listing Agent Commission (%) *</Label>
                <Input
                  id="listingAgentCommission"
                  name="listingAgentCommission"
                  type="number"
                  step="0.01"
                  value={formData.listingAgentCommission || ''}
                  onChange={handleInputChange}
                  required={formData.agentRole === "Listing Agent"}
                />
              </div>
            )}

            {shouldShowField('B') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="buyersAgentCommission">Buyer's Agent Commission (%) *</Label>
                  <Input
                    id="buyersAgentCommission"
                    name="buyersAgentCommission"
                    type="number"
                    step="0.01"
                    value={formData.buyersAgentCommission || ''}
                    onChange={handleInputChange}
                    required={formData.agentRole === "Buyer's Agent"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerPaidCommission">Buyer-Paid Commission ($)</Label>
                  <Input
                    id="buyerPaidCommission"
                    name="buyerPaidCommission"
                    type="number"
                    step="0.01"
                    value={formData.buyerPaidCommission || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerPaidCommissionPercentage">Buyer-Paid Commission (%)</Label>
                  <Input
                    id="buyerPaidCommissionPercentage"
                    name="buyerPaidCommissionPercentage"
                    type="number"
                    step="0.01"
                    value={formData.buyerPaidCommissionPercentage || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Referral Information */}
          {shouldShowField('BS') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Referral Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="referralParty">Referring Party</Label>
                <Input
                  id="referralParty"
                  name="referralParty"
                  value={formData.referralParty || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brokerEIN">Broker's EIN</Label>
                <Input
                  id="brokerEIN"
                  name="brokerEIN"
                  value={formData.brokerEIN || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralFeePercentage">Referral Fee (%)</Label>
                <Input
                  id="referralFeePercentage"
                  name="referralFeePercentage"
                  type="number"
                  step="0.01"
                  value={formData.referralFeePercentage || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Transaction Details and Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction Details and Requirements</h3>

            {shouldShowField('BS') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resaleCertHOAName">Resale Cert Required? If YES, list name of HOA</Label>
                  <Input
                    id="resaleCertHOAName"
                    name="resaleCertHOAName"
                    value={formData.resaleCertHOAName || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coTownship">C/O Required? If YES, list the Township/Municipality</Label>
                  <Input
                    id="coTownship"
                    name="coTownship"
                    value={formData.coTownship || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {shouldShowField('S') && (
              <div className="space-y-2">
                <Label htmlFor="firstRightOfRefusal">First Right of Refusal? If YES, list who</Label>
                <Input
                  id="firstRightOfRefusal"
                  name="firstRightOfRefusal"
                  value={formData.firstRightOfRefusal}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {shouldShowField('BS') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="attorneyName">Attorney Name</Label>
                  <Input
                    id="attorneyName"
                    name="attorneyName"
                    value={formData.attorneyName || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeWarrantyCompany">Home Warranty Company</Label>
                  <Input
                    id="homeWarrantyCompany"
                    name="homeWarrantyCompany"
                    value={formData.homeWarrantyCompany || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyCost">Warranty Cost</Label>
                  <Input
                    id="warrantyCost"
                    name="warrantyCost"
                    type="number"
                    value={formData.warrantyCost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPaidBy">Warranty Paid By</Label>
                  <Input
                    id="warrantyPaidBy"
                    name="warrantyPaidBy"
                    value={formData.warrantyPaidBy || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Title Information */}
          {shouldShowField('BS') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Title Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="titleCompany">Title Company</Label>
                <Input
                  id="titleCompany"
                  name="titleCompany"
                  value={formData.titleCompany || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>TC Fee Paid By *</Label>
                <RadioGroup
                  value={formData.tcFeePaidBy}
                  onValueChange={value => handleSelectChange('tcFeePaidBy', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Client" id="tcFeeClient" />
                    <Label htmlFor="tcFeeClient">Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agent" id="tcFeeAgent" />
                    <Label htmlFor="tcFeeAgent">Agent</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Property Status and Access */}
          {shouldShowField('S') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Status and Access</h3>
              
              <div className="space-y-2">
                <Label>Property Status</Label>
                <RadioGroup
                  value={formData.propertyStatus}
                  onValueChange={value => handleSelectChange('propertyStatus', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vacant" id="statusVacant" />
                    <Label htmlFor="statusVacant">Vacant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Occupied" id="statusOccupied" />
                    <Label htmlFor="statusOccupied">Occupied</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Winterized" id="statusWinterized" />
                    <Label htmlFor="statusWinterized">Winterized</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Access Information</Label>
                <RadioGroup
                  value={formData.accessInformation}
                  onValueChange={value => handleSelectChange('accessInformation', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Electronic Lock Box" id="accessElectronic" />
                    <Label htmlFor="accessElectronic">Electronic Lock Box</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Combo Lock Box" id="accessCombo" />
                    <Label htmlFor="accessCombo">Combo Lock Box</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Appointment Only" id="accessAppointment" />
                    <Label htmlFor="accessAppointment">Appointment Only</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  name="accessCode"
                  value={formData.accessCode || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Update MLS to "Pending"?</Label>
                <RadioGroup
                  value={formData.updateMLS ? 'yes' : 'no'}
                  onValueChange={value => handleSelectChange('updateMLS', value === 'yes')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="updateMLSYes" />
                    <Label htmlFor="updateMLSYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="updateMLSNo" />
                    <Label htmlFor="updateMLSNo">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit Transaction
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default IntakeForm;