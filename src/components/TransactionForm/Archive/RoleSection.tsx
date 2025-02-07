import React from 'react';
import { FormSection } from './FormSection';
import { TransactionFormData, AgentRole } from './types';
import { FormSectionProps } from './types';
import { Search, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../../lib/utils";
import { HelpButton, helpContentBySection } from './HelpButton';
import { Alert, AlertDescription } from '../ui/alert';

const roleIcons = {
  "Buyer's Agent": Search,
  "Listing Agent": FileText,
  "Dual Agent": RefreshCw,
} as const;

const roleDescriptions = {
  "Buyer's Agent": "Represent buyers in their search for the perfect property",
  "Listing Agent": "Market and sell properties on behalf of sellers",
  "Dual Agent": "Represent both buyer and seller in the transaction",
} as const;

export const RoleSection = ({ 
  formData, 
  onUpdate,
  getValidationState,
  getFieldError 
}: FormSectionProps) => {
  const error = getFieldError('role');
  const validationState = getValidationState('role');
  const hasSelectedRole = Object.keys(roleIcons).includes(formData.role);
  const showError = error && !hasSelectedRole;
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">Select Your Role</h2>
          <HelpButton content={helpContentBySection.role} />
        </div>
        <div className="text-sm text-red-500">* Required</div>
      </div>

      {showError && error.trim() !== '' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-gray-600">
        Choose the role that best describes your position in this transaction. 
        Your selection will determine the required documents and information needed.
      </p>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {(Object.keys(roleIcons) as AgentRole[]).map((role, index) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={cn(
              "relative p-8 rounded-xl",
              "transition-all duration-300",
              "cursor-pointer",
              "bg-white",
              "group",
              formData.role === role
                ? "ring-2 ring-[#1e3a8a] shadow-lg"
                : validationState === 'invalid'
                ? "border-2 border-red-200 hover:border-red-300"
                : "border border-gray-200 hover:border-[#1e3a8a] hover:shadow-md"
            )}
            onClick={() => onUpdate("role", role)}
          >
            {/* Background gradient effect */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
              "bg-gradient-to-br from-[#1e3a8a]/5 via-transparent to-[#ffd7ba]/5",
              formData.role === role ? "opacity-100" : "group-hover:opacity-100"
            )} />
            {/* Content */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className={cn(
                "p-4 rounded-full",
                "transition-all duration-300",
                formData.role === role
                  ? "bg-[#1e3a8a] text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a]"
              )}>
                {role in roleIcons && React.createElement(roleIcons[role as keyof typeof roleIcons], { size: 24 })}
              </div>

              {/* Role Title */}
              <h3 className={cn(
                "text-lg font-semibold transition-colors duration-200",
                formData.role === role
                  ? "text-[#1e3a8a]"
                  : "text-gray-900 group-hover:text-[#1e3a8a]"
              )}>
                {role}
              </h3>

              {/* Role Description */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                  {role in roleDescriptions ? roleDescriptions[role as keyof typeof roleDescriptions] : ''}
                </p>
                <AnimatePresence>
                  {formData.role === role && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="text-xs text-gray-500 space-y-1 mt-2">
                        {role === "Buyer's Agent" && [
                          "Access to MLS listings",
                          "Buyer representation agreement required",
                          "Commission from seller's side"
                        ].map((detail, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            {detail}
                          </li>
                        ))}
                        {role === "Listing Agent" && [
                          "Property marketing responsibilities",
                          "Seller representation agreement required",
                          "Commission split management"
                        ].map((detail, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            {detail}
                          </li>
                        ))}
                        {role === "Dual Agent" && [
                          "Dual agency disclosure required",
                          "Balanced representation duties",
                          "Special documentation needed"
                        ].map((detail, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Selection Indicator */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-300",
                formData.role === role
                  ? "border-[#1e3a8a] bg-[#1e3a8a]"
                  : "border-gray-300 group-hover:border-[#1e3a8a]"
              )}>
                {formData.role === role && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full rounded-full bg-white scale-[0.4]"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
