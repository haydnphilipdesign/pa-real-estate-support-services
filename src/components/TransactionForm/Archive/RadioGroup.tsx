import { RadioGroup as RadixRadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

export const RadioGroup = ({ 
  options, 
  value, 
  onChange,
  orientation = "vertical" 
}: RadioGroupProps) => {
  return (
    <RadixRadioGroup
      value={value}
      onValueChange={onChange}
      className={orientation === "horizontal" ? "flex gap-4" : "space-y-2"}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadixRadioGroup>
  );
}; 