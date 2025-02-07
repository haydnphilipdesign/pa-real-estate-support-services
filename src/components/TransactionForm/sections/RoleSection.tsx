import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { AgentRole } from '../types';
import { Button } from '../../ui/button';
import { Home, Users, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { useForm, useFormField, useFormSection } from '../context/FormContext';
import { validateField } from '../services/validation';

export const RoleSection: React.FC = () => {
  const { state, resetForm } = useForm();
  const { value: role, updateValue: updateRole, touch, validation } = useFormField('role');
  const { isActive, complete } = useFormSection(0);

  const roleOptions: Array<{
    role: AgentRole;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      role: 'Listing Agent',
      label: 'Listing Agent',
      icon: <Home className="h-5 w-5" />,
      description: 'Representing the seller'
    },
    {
      role: 'Buyer\'s Agent',
      label: 'Buyer\'s Agent',
      icon: <User className="h-5 w-5" />,
      description: 'Representing the buyer'
    },
    {
      role: 'Dual Agent',
      label: 'Dual Agent',
      icon: <Users className="h-5 w-5" />,
      description: 'Representing both parties'
    }
  ];

  const handleRoleSelect = (selectedRole: AgentRole) => {
    // If changing roles, reset the form but keep the new role
    if (role && role !== selectedRole) {
      resetForm();
      updateRole(selectedRole);
    } else {
      updateRole(selectedRole);
    }

    // Validate the selection
    const validationResult = validateField('role', selectedRole);
    if (validationResult.isValid) {
      complete();
    }

    // Mark the field as touched
    touch();
  };

  if (!isActive) return null;

  return (
    <FormSectionContainer>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Role Selection</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldWrapper
          label="Your Role"
          required
          error={validation?.isValid === false ? validation.errors[0] : undefined}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {roleOptions.map((option) => (
              <Button
                key={option.role}
                type="button"
                variant={role === option.role ? "default" : "outline"}
                className={`
                  h-auto min-h-[120px] sm:min-h-[160px] w-full p-3 sm:p-4
                  flex flex-col items-center justify-center gap-2 sm:gap-3
                  text-center transition-all
                  ${role === option.role 
                    ? 'bg-[#1e3a8a] text-white hover:bg-[#1e3a8a]/90' 
                    : 'hover:border-[#1e3a8a]/50'}
                `}
                onClick={() => handleRoleSelect(option.role)}
              >
                <div className={`
                  p-2 sm:p-3 rounded-full 
                  ${role === option.role 
                    ? 'bg-white/20' 
                    : 'bg-[#1e3a8a]/5'}
                `}>
                  {option.icon}
                </div>
                <span className="font-semibold text-sm sm:text-base">{option.label}</span>
                <span className={`
                  text-xs sm:text-sm 
                  ${role === option.role 
                    ? 'text-white/80' 
                    : 'text-gray-500'}
                `}>
                  {option.description}
                </span>
              </Button>
            ))}
          </div>
        </FormFieldWrapper>

        {!role && validation?.touched && (
          <Alert className="mt-4" variant="destructive">
            <AlertTitle>Role Selection Required</AlertTitle>
            <AlertDescription>
              Please select your role to proceed with the transaction form.
            </AlertDescription>
          </Alert>
        )}

        <Alert className="mt-6 sm:mt-8">
          <AlertTitle>Role Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Select the role that best describes your position in this transaction</li>
              <li>Your role selection will determine the available options throughout the form</li>
              <li>This selection cannot be changed once you proceed to the next section</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSectionContainer>
  );
};
