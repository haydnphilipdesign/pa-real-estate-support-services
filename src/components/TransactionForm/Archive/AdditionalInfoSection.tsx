import { FormSection } from "../ui/form";
import { FormField } from "./FormField";
import { Textarea } from "../ui/textarea";
import { FormSectionProps } from "./types";

export const AdditionalInfoSection = ({ formData, onUpdate }: FormSectionProps) => {
  return (
    <FormSection>
      <h2 className="text-lg font-semibold mb-6">Additional Information</h2>
      
      <div className="space-y-6">
        <FormField 
          label="Special Instructions" 
          description="Enter any special handling instructions or requirements"
        >
          <Textarea
            value={formData.specialInstructions}
            onChange={(e) => onUpdate("specialInstructions", e.target.value)}
            placeholder="Enter any special instructions..."
            className="min-h-[100px]"
          />
        </FormField>

        <FormField 
          label="Urgent Issues" 
          description="List any urgent issues that need immediate attention"
        >
          <Textarea
            value={formData.urgentIssues}
            onChange={(e) => onUpdate("urgentIssues", e.target.value)}
            placeholder="Enter any urgent issues..."
            className="min-h-[100px]"
          />
        </FormField>

        <FormField 
          label="Additional Notes" 
          description="Any other relevant information or notes"
        >
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => onUpdate("additionalNotes", e.target.value)}
            placeholder="Enter any additional notes..."
            className="min-h-[100px]"
          />
        </FormField>
      </div>
    </FormSection>
  );
}; 