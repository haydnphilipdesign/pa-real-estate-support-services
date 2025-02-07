import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from 'lucide-react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { agentName: string, dateSubmitted: string }) => void;
  initialAgentName?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  initialAgentName = ''
}) => {
  const [agentName, setAgentName] = React.useState(initialAgentName);
  const [error, setError] = React.useState('');
  const [dateSubmitted] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSubmit = () => {
    if (!agentName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    
    // Format date as MM/DD/YYYY
    const date = new Date(dateSubmitted);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    // Call onConfirm with the validated and formatted data
    onConfirm({
      agentName: agentName.trim(),
      dateSubmitted: formattedDate
    });
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setAgentName(initialAgentName || '');
      setError('');
    }
  }, [open, initialAgentName]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Final Submission Confirmation</DialogTitle>
          <DialogDescription className="text-base">
            Please review and confirm that all information provided is accurate and complete.
            This submission will be processed by our transaction coordination team.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="w-5 h-5 text-blue-500" />
            <AlertDescription className="text-blue-800">
              By submitting this form, you acknowledge that:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>All transaction details are accurate and complete</li>
                <li>Required documents have been uploaded to DocuSign/Dotloop</li>
                <li>Commission information and calculations are correct</li>
                <li>Property and client information has been verified</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agentName" className="text-sm font-medium">
                  Agent Signature <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => {
                    setAgentName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Type your full name"
                  className={`mt-1 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateSubmitted" className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateSubmitted"
                  type="date"
                  value={dateSubmitted}
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Clicking "Submit Form" confirms that you have reviewed all information and certify its accuracy.
              Any inaccuracies may delay processing and could require resubmission.
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Review Again
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
          >
            Submit Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 