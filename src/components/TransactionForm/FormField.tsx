import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { FieldHelp } from './FieldHelp';
import { ValidationFeedback } from './ValidationFeedback';
import { validationRules } from '../../services/validation';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value: string;
  error?: string[];
  touched?: boolean;
  onValueChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  containerClassName?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  error,
  touched,
  onValueChange,
  onFocus,
  onBlur,
  className,
  containerClassName,
  required = false,
  type = 'text',
  placeholder,
  disabled = false,
  ...props
}) => {
  const hasError = touched && error && error.length > 0;
  const rules = validationRules[name] || [];

  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={name}
          className={cn(
            'text-sm font-medium',
            hasError ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <FieldHelp fieldName={name} className="ml-2" />
      </div>

      <div className="relative">
        <Input
          id={name}
          type={type}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full',
            hasError && 'border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...props}
        />
      </div>

      {touched && (
        <ValidationFeedback
          fieldName={name}
          value={value}
          rules={rules}
          touched={touched}
          className="mt-1"
        />
      )}
    </div>
  );
};

// Select Field Component
interface SelectFieldProps extends Omit<FormFieldProps, 'type'> {
  options: Array<{ value: string; label: string }>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  options,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', props.containerClassName)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={props.name}
          className={cn(
            'text-sm font-medium',
            props.error ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <FieldHelp fieldName={props.name} className="ml-2" />
      </div>

      <select
        id={props.name}
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        disabled={props.disabled}
        className={cn(
          'w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          props.error && 'border-red-500 focus:ring-red-500',
          props.className
        )}
      >
        <option value="">Select {props.label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {props.touched && (
        <ValidationFeedback
          fieldName={props.name}
          value={props.value}
          rules={validationRules[props.name] || []}
          touched={props.touched}
          className="mt-1"
        />
      )}
    </div>
  );
};

// Checkbox Field Component
interface CheckboxFieldProps extends Omit<FormFieldProps, 'value' | 'onValueChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onCheckedChange,
  onFocus,
  onBlur,
  className,
  containerClassName,
  disabled = false,
  ...props
}) => {
  return (
    <div className={cn('flex items-center space-x-2', containerClassName)}>
      <input
        type="checkbox"
        id={name}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
          className
        )}
        {...props}
      />
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        {label}
      </Label>
      <FieldHelp fieldName={name} className="ml-2" />
    </div>
  );
}; 