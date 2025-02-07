interface TaskStatus {
  completed: boolean;
  details?: string;
  dependencies?: string[];
  priority: 'high' | 'medium' | 'low';
}

const transactionFormUpdates = {
  context: {
    lastCompleted: "Documents Tab features completed",
    nextFocus: "Navigation improvements",
    currentBranch: "feature/form-updates"
  },

  roleTab: {
    layoutFix: {
      completed: true,
      details: "Implemented with space-y-8, justify-items-center, w-full max-w-xs, p-8",
      priority: "high"
    },
    iconPaths: {
      completed: true,
      details: "Updated to use /assets/icons/ directory",
      priority: "high"
    }
  },

  propertyTab: {
    googlePlacesAPI: {
      completed: true,
      details: "Implemented address autocomplete functionality",
      priority: "high"
    },
    priceInput: {
      completed: true,
      details: "Fixed currency input formatting and validation",
      priority: "high"
    }
  },

  clientTab: {
    addressAutocomplete: {
      completed: true,
      details: "Implemented Google Places API integration",
      dependencies: ["propertyTab.googlePlacesAPI"],
      priority: "high"
    },
    emailValidation: {
      completed: true,
      details: "Updated validation to show errors instead of clearing input",
      priority: "high"
    },
    additionalClients: {
      completed: true,
      details: "Enabled adding up to 4 clients with persistent add button",
      priority: "medium"
    },
    dualAgentClients: {
      completed: true,
      details: "Added designation for listing/buyer side clients",
      priority: "high"
    },
    removeMaritalNote: {
      completed: true,
      details: "Removed marital status update note",
      priority: "low"
    }
  },

  commissionTab: {
    percentageInput: {
      completed: true,
      details: "Fixed commission percentage input formatting",
      priority: "high"
    },
    buyerAgentView: {
      completed: true,
      details: "Hidden total commission for buyer's agents",
      priority: "high"
    },
    moveReferralFields: {
      completed: true,
      details: "Moved referral fields to Property Details tab",
      priority: "medium"
    }
  },

  documentsTab: {
    requiredDocs: {
      completed: true,
      details: "Implemented checklist system with role-specific document requirements",
      priority: "high"
    },
    textUpdates: {
      completed: true,
      details: "Updated text elements and descriptions",
      priority: "medium"
    },
    winterizedQuestion: {
      completed: true,
      details: "Added winterized status dropdown with multiple options",
      priority: "medium"
    },
    accessInfo: {
      completed: true,
      details: "Added access information dropdown with various options",
      priority: "medium"
    },
    mlsUpdate: {
      completed: true,
      details: "Added MLS pending status toggle for listing/dual agents",
      priority: "high"
    }
  },

  additionalInfoTab: {
    reorganization: {
      completed: true,
      details: "Moved title company and property access to new tab before documents",
      priority: "medium"
    },
    notesSection: {
      completed: true,
      details: "Moved additional notes to separate tab after documents",
      priority: "medium"
    }
  },

  signTab: {
    heading: {
      completed: true,
      details: "Added section title/heading",
      priority: "low"
    },
    dateNote: {
      completed: true,
      details: "Removed date verification note",
      priority: "low"
    }
  },

  navigation: {
    textRemoval: {
      completed: true,
      details: "Removed text labels, using only icons with tooltips",
      priority: "medium"
    }
  }
};

// Progress Summary
const completedTasks = 24;
const totalTasks = 24;
const progressPercentage = (completedTasks / totalTasks) * 100;

// Next Steps
const nextTask = "Review and improve navigation experience";

export type TransactionFormTasks = typeof transactionFormUpdates;