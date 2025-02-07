import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ValidationRule } from '../../services/validation';

interface ValidationFeedbackProps {
  fieldName: string;
  value: any;
  rules: ValidationRule[];
  touched: boolean;
  className?: string;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  fieldName,
  value,
  rules,
  touched,
  className
}) => {
  const [validationState, setValidationState] = React.useState<{
    isValid: boolean;
    messages: string[];
  }>({ isValid: false, messages: [] });

  React.useEffect(() => {
    if (!touched) return;

    const messages: string[] = [];
    let isValid = true;

    rules.forEach(rule => {
      const result = rule.validate(value);
      if (!result.isValid) {
        messages.push(result.message);
        isValid = false;
      }
    });

    setValidationState({ isValid, messages });
  }, [value, rules, touched]);

  if (!touched) return null;

  return (
    <div className={cn('mt-1', className)}>
      {validationState.isValid ? (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>Valid</span>
        </div>
      ) : (
        <div className="space-y-1">
          {validationState.messages.map((message, index) => (
            <div key={index} className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Validation Rules Component for displaying all rules
interface ValidationRulesDisplayProps {
  rules: ValidationRule[];
  className?: string;
}

export const ValidationRulesDisplay: React.FC<ValidationRulesDisplayProps> = ({
  rules,
  className
}) => {
  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      <h4 className="font-medium mb-1">Validation Rules:</h4>
      <ul className="list-disc list-inside space-y-1">
        {rules.map((rule, index) => (
          <li key={index}>{rule.description}</li>
        ))}
      </ul>
    </div>
  );
};

// Field Status Indicator Component
interface FieldStatusProps {
  isValid: boolean;
  isTouched: boolean;
  className?: string;
}

export const FieldStatus: React.FC<FieldStatusProps> = ({
  isValid,
  isTouched,
  className
}) => {
  if (!isTouched) return null;

  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        isValid ? 'bg-green-500' : 'bg-red-500',
        className
      )}
    />
  );
};

// Section Validation Progress Component
interface SectionProgressProps {
  totalFields: number;
  validFields: number;
  className?: string;
}

export const SectionProgress: React.FC<SectionProgressProps> = ({
  totalFields,
  validFields,
  className
}) => {
  const percentage = (validFields / totalFields) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span>Section Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {validFields} of {totalFields} fields validated
      </div>
    </div>
  );
}; 