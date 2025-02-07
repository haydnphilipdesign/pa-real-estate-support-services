import React from 'react';
import { cn } from '../../../lib/utils';
import { Switch } from '../../ui/switch';

interface FormFieldGroupProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

interface ToggleFieldGroupProps extends FormFieldGroupProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  toggleLabel?: string;
  toggleDescription?: string;
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  description,
  className,
  children
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export const ToggleFieldGroup: React.FC<ToggleFieldGroupProps> = ({
  title,
  description,
  className,
  children,
  checked,
  onToggle,
  toggleLabel,
  toggleDescription
}) => {
  return (
    <FormFieldGroup
      title={title}
      description={description}
      className={className}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {toggleLabel && (
            <label className="text-sm font-medium text-gray-900">{toggleLabel}</label>
          )}
          {toggleDescription && (
            <p className="text-sm text-gray-500">{toggleDescription}</p>
          )}
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onToggle}
        />
      </div>
      {checked && children}
    </FormFieldGroup>
  );
};

export const GridFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  description,
  className,
  children
}) => {
  return (
    <FormFieldGroup
      title={title}
      description={description}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>
    </FormFieldGroup>
  );
};

export const InfoBox: React.FC<{
  title: string;
  items: string[];
  className?: string;
}> = ({ title, items, className }) => {
  return (
    <div className={cn("p-4 bg-blue-50 rounded-lg", className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-800">
            {title}
          </h4>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            {items.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};