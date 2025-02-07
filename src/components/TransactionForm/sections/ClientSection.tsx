import React, { useState, useEffect } from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormInput } from '../../ui/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useFormSection } from '../../../hooks/useFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { ClientInfo, MaritalStatus, ClientDesignation } from '../types';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { AddressAutocomplete } from '../../ui/AddressAutocomplete';

export const ClientSection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'client',
    sectionIndex: 2
  });

  const [clientCount, setClientCount] = useState<number>(1);

  const maxClients = formData.role === "Dual Agent" ? 4 : 2;

  // Add effect to sync clientCount with actual clients array length
  useEffect(() => {
    if (formData.clients?.length !== clientCount) {
      setClientCount(formData.clients?.length || 1);
    }
  }, [formData.clients?.length]);

  const handleClientCountChange = (value: string) => {
    const count = parseInt(value);
    setClientCount(count);
    
    // Update clients array size
    const newClients = [...formData.clients];
    if (count > newClients.length) {
      // Add new clients
      while (newClients.length < count) {
        newClients.push({
          name: '',
          address: '',
          email: '',
          phone: '',
          maritalStatus: 'Single',
          designation: formData.role === "Buyer's Agent" ? "Buyer" : 
                      formData.role === "Listing Agent" ? "Seller" : ""
        });
      }
    } else {
      // Remove excess clients
      newClients.length = count;
    }
    updateField('clients', newClients);
  };

  const updateClient = (index: number, field: keyof ClientInfo, value: string) => {
    const newClients = [...formData.clients];
    newClients[index] = {
      ...newClients[index],
      [field]: value
    };
    updateField('clients', newClients);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  return (
    <FormSectionContainer>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">Client Information</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldGroup title="Number of Clients" description="Select how many clients you need to enter information for">
          <FormFieldWrapper label="Number of Clients" required>
            <Select
              value={clientCount.toString()}
              onValueChange={handleClientCountChange}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select number of clients" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxClients }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="h-12 text-base">
                    {i + 1} Client{i > 0 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </FormFieldGroup>

        <div className="mt-6">
          {formData.clients.map((client, index) => (
            <div key={`client-${index}`} className="mb-8 last:mb-0">
              <FormFieldGroup
                title={`Client ${index + 1}`}
                description={`Enter information for client ${index + 1}`}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
                  <FormFieldWrapper
                    label="Full Name"
                    required
                    error={getFieldValidationState(`clients.${index}.name` as any) === 'invalid' ? getFieldError(`clients.${index}.name` as any) : undefined}
                  >
                    <FormInput
                      value={client.name}
                      onChange={(e) => updateClient(index, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className="h-12 text-base"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Address"
                    required
                    error={getFieldValidationState(`clients.${index}.address` as any) === 'invalid' ? getFieldError(`clients.${index}.address` as any) : undefined}
                  >
                    <AddressAutocomplete
                      value={client.address}
                      onChange={(value) => updateClient(index, 'address', value)}
                      placeholder="Enter client address"
                      className="h-12 text-base"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Email"
                    required
                    error={!validateEmail(client.email) && client.email !== '' ? 'Please enter a valid email address' : undefined}
                  >
                    <FormInput
                      value={client.email}
                      onChange={(e) => updateClient(index, 'email', e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                      className="h-12 text-base"
                      inputMode="email"
                      autoCapitalize="off"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Phone"
                    required
                    error={!validatePhone(client.phone) && client.phone !== '' ? 'Please enter a valid phone number' : undefined}
                  >
                    <FormInput
                      value={client.phone}
                      onChange={(e) => updateClient(index, 'phone', e.target.value.replace(/[^\d-. ()]/, ''))}
                      placeholder="(555) 555-5555"
                      type="tel"
                      className="h-12 text-base"
                      inputMode="tel"
                      pattern="[0-9]*"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Marital Status" required>
                    <Select
                      value={client.maritalStatus}
                      onValueChange={(value) => updateClient(index, 'maritalStatus', value as MaritalStatus)}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single" className="h-12 text-base">Single</SelectItem>
                        <SelectItem value="Married" className="h-12 text-base">Married</SelectItem>
                        <SelectItem value="Divorce" className="h-12 text-base">Divorced</SelectItem>
                        <SelectItem value="Widowed" className="h-12 text-base">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>

                  {formData.role === "Dual Agent" && (
                    <FormFieldWrapper label="Client Designation" required>
                      <Select
                        value={client.designation}
                        onValueChange={(value) => updateClient(index, 'designation', value as ClientDesignation)}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select client designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Buyer" className="h-12 text-base">Buyer</SelectItem>
                          <SelectItem value="Seller" className="h-12 text-base">Seller</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>
                  )}
                </div>
              </FormFieldGroup>
            </div>
          ))}
        </div>

        <Alert className="mt-6 sm:mt-8">
          <AlertTitle>Client Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-2 text-sm sm:text-base">
              <li>You can add up to {maxClients} client{maxClients > 1 ? 's' : ''}</li>
              <li>All fields marked with * are required</li>
              <li>Please ensure email addresses and phone numbers are valid</li>
              {formData.role === "Dual Agent" && (
                <li>For dual agency, please specify whether each client is a buyer or seller</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSectionContainer>
  );
};
