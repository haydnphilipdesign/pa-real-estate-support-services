import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormSectionLayoutProps {
  title?: string; // Made optional since we'll show it in nav only
  icon?: LucideIcon;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionLayoutProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header with Title and Description */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-blue-50">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
