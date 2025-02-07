import React, { useCallback } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useInputFormat } from '../../hooks/useInputFormat';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  tooltip?: string;
  error?: string;
  warning?: string;
  description?: string;
  helpText?: string;
  type?: 'text' | 'phone' | 'email' | 'currency' | 'percentage' | 'mls';
  value?: string;
  onChange?: (value: string) => void;
  validationState?: 'valid' | 'invalid' | 'warning' | null;
  id?: string;
  'aria-describedby'?: string;
}

export const FormField = ({
  label,
  children,
  required,
  tooltip,
  error,
  warning,
  description,
  helpText,
  type = 'text',
  value,
  onChange,
  validationState,
  id,
  'aria-describedby': ariaDescribedby,
}: FormFieldProps) => {
  const {
    formatPhoneNumber,
    formatPercentage,
    formatCurrency,
    formatMLSNumber
  } = useInputFormat();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const inputValue = e.target.value;
    let formattedValue = inputValue;

    switch (type) {
      case 'phone':
        formattedValue = formatPhoneNumber(inputValue);
        break;
      case 'percentage':
        formattedValue = formatPercentage(inputValue);
        break;
      case 'currency':
        formattedValue = formatCurrency(inputValue);
        break;
      case 'mls':
        formattedValue = formatMLSNumber(inputValue);
        break;
      default:
        formattedValue = inputValue;
    }

    onChange(formattedValue);
  }, [type, onChange, formatPhoneNumber, formatPercentage, formatCurrency, formatMLSNumber]);

  const getInputType = (fieldType: string): string => {
    switch (fieldType) {
      case 'email':
        return 'email';
      case 'phone':
      case 'currency':
      case 'percentage':
      case 'mls':
        return 'text';
      default:
        return 'text';
    }
  };

  const getPlaceholder = (fieldType: string): string => {
    switch (fieldType) {
      case 'phone':
        return '(XXX) XXX-XXXX';
      case 'email':
        return 'email@example.com';
      case 'currency':
        return '$0.00';
      case 'percentage':
        return '0%';
      case 'mls':
        return 'PM-123456';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-3 group relative">
      <div className="flex items-center gap-2">
        <motion.label 
          htmlFor={id}
          className={cn(
            "block text-sm font-semibold transition-all duration-300",
            validationState === 'invalid' ? "text-red-600" :
            validationState === 'warning' ? "text-amber-600" :
            validationState === 'valid' ? "text-emerald-600" :
            "text-gray-800 group-hover:text-[#1e3a8a]"
          )}
          whileHover={{ scale: 1.02 }}
        >
          {label}
          {required && (
            <motion.span 
              className="text-red-500 ml-1 inline-block"
              animate={{ 
                opacity: [1, 0.5, 1],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              *
            </motion.span>
          )}
        </motion.label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button 
                  type="button" 
                  className="text-gray-400 hover:text-[#1e3a8a] transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HelpCircle className="h-4 w-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-gradient-to-br from-[#1e3a8a] to-[#2d4ba0] text-white text-sm py-3 px-4 rounded-xl shadow-xl border border-white/10 backdrop-blur-sm"
                sideOffset={5}
              >
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tooltip}
                </motion.div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {(description || helpText) && (
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {description && (
            <motion.p 
              className="text-sm text-gray-500 italic group-hover:text-gray-600 transition-all duration-300"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
          {helpText && (
            <motion.p 
              className="text-xs text-gray-500 group-hover:text-gray-600 transition-all duration-300"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {helpText}
            </motion.p>
          )}
        </motion.div>
      )}
      
      <div className="mt-2 relative group">
        {/* Enhanced validation status indicator */}
        {validationState && (
          <motion.div 
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full",
              "transition-all duration-300 shadow-sm",
              validationState === 'valid' && "bg-emerald-100 group-hover:bg-emerald-200",
              validationState === 'invalid' && "bg-red-100 group-hover:bg-red-200",
              validationState === 'warning' && "bg-amber-100 group-hover:bg-amber-200"
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            {validationState === 'valid' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
            {validationState === 'invalid' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            )}
            {validationState === 'warning' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </motion.svg>
            )}
          </motion.div>
        )}
        
        {/* Input highlight effect */}
        <div className={cn(
          "absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
          validationState === 'valid' && "bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0",
          validationState === 'invalid' && "bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0",
          validationState === 'warning' && "bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0",
          !validationState && "bg-gradient-to-r from-[#1e3a8a]/0 via-[#1e3a8a]/10 to-[#1e3a8a]/0"
        )} />
        
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // Handle textarea separately
            if (typeof child.type === 'string' && child.type.toLowerCase() === 'textarea') {
              return React.cloneElement(child as React.ReactElement<any>, {
                className: cn(
                  (child as any).props.className,
                  "border-white/50",
                  "hover:border-white/70",
                  "focus:ring-2",
                  "focus:ring-[#1e3a8a]/20",
                  "focus:border-[#1e3a8a]",
                  "transition-all duration-300",
                  "bg-white/30 backdrop-blur-sm",
                  error && "border-red-500 focus:border-red-500 focus:ring-red-200"
                )
              });
            }
            
            // Handle input elements
            if (typeof child.type === 'string' && child.type.toLowerCase() === 'input') {
              return React.cloneElement(child as React.ReactElement<any>, {
                type: getInputType(type),
                placeholder: getPlaceholder(type),
                value: value,
                onChange: handleInputChange,
                id,
                'aria-describedby': ariaDescribedby,
                'aria-invalid': validationState === 'invalid',
                className: cn(
                  (child as any).props.className,
                  "border-white/50",
                  "hover:border-white/70",
                  "focus:ring-2",
                  "transition-all duration-300",
                  "bg-white/30 backdrop-blur-sm",
                  validationState === 'valid' && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-200",
                  validationState === 'invalid' && "border-red-500 focus:border-red-500 focus:ring-red-200",
                  validationState === 'warning' && "border-amber-500 focus:border-amber-500 focus:ring-amber-200",
                  !validationState && "focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]",
                  "pr-10" // Make room for validation icon
                )
              });
            }
          }
          return child;
        })}
      </div>
      
      {/* Error/Warning Messages */}
      <div className="space-y-2 mt-2">
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
              className="text-sm text-red-500 flex items-center gap-2 bg-red-50/50 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-red-200/50"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </motion.p>
        )}
        {warning && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
              className="text-sm text-amber-600 flex items-center gap-2 bg-amber-50/50 backdrop-blur-sm py-1.5 px-3 rounded-lg border border-amber-200/50"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {warning}
          </motion.p>
        )}
      </div>
    </div>
  );
};
