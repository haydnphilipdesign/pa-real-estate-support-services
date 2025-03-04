# Get the current directory where the script is running
$baseDir = Get-Location
Write-Host "Scanning directory: $baseDir"

# Safelist of files that should never be deleted (using normalized paths)
$safelist = @(
    "App.tsx",
    "vite-env.d.ts",
    "vitest.config.ts",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "src/components/Form.tsx",           # Main website contact form
    "src\components\Form.tsx",           # Alternative path format
    "src/pages/AgentPortal.tsx",        # New form
    "src\pages\AgentPortal.tsx"         # Alternative path format
)

# Files/patterns to preserve (contact form related)
$preservePatterns = @(
    "Contact",
    "ContactForm",
    "useContact",
    "Form\.tsx$",
    "EmailJS",
    "contact-form",
    "contact_form",
    "AgentPortal"
)

# Patterns to match for deletion (transaction form related)
$patterns = @(
    "TransactionForm",
    "useTransactionForm",
    "DocumentsSection",
    "PropertySection",
    "ClientSection",
    "AgentSection",
    "FormSection",
    "airtable",
    "FormProgress",
    "FormNavigation",
    "FormValidation",
    "FormContext",
    "FieldGroup"
)

# Function to normalize path for comparison
function NormalizePath($path) {
    return $path.Replace('\', '/').TrimStart('/')
}

# Get all project files, excluding node_modules and safelisted files
$allFiles = Get-ChildItem -Path $baseDir -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Extension -match '\.(ts|tsx|js|jsx|md|py)$' -and 
        $_.FullName -notmatch 'node_modules' -and
        $_.FullName -notmatch '\\dist\\' -and
        $_.FullName -notmatch '\\.git\\'
    }

Write-Host "Found $($allFiles.Count) files to analyze"

# Initialize array for files to delete
$filesToDelete = @()

# First pass: Add files matching known patterns
foreach ($file in $allFiles) {
    if ($null -eq $file) { continue }
    
    $relativePath = $file.FullName.Replace("$baseDir\", "")
    $normalizedPath = NormalizePath($relativePath)
    
    # Skip if file is in safelist
    if ($safelist -contains $normalizedPath -or $safelist -contains $relativePath) {
        Write-Host "Skipping safelisted file: $relativePath"
        continue
    }
    
    # Skip files that match preserve patterns
    $shouldPreserve = $false
    foreach ($pattern in $preservePatterns) {
        if ($file.Name -match $pattern -or $normalizedPath -match $pattern) {
            $shouldPreserve = $true
            Write-Host "Preserving contact form related file: $relativePath"
            break
        }
    }
    if ($shouldPreserve) { continue }
    
    # Check if file matches deletion patterns
    $shouldDelete = $false
    foreach ($pattern in $patterns) {
        if ($file.Name -match $pattern -or $normalizedPath -match $pattern) {
            $shouldDelete = $true
            Write-Host "Pattern match found in: $relativePath"
            break
        }
    }
    
    if ($shouldDelete) {
        # Double check it's not a contact form file
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not ($content -match "ContactForm|EmailJS|contact-form")) {
            $filesToDelete += $relativePath
        }
    }
}

Write-Host "Found $($filesToDelete.Count) files in initial scan"

# Filter out duplicates
$filesToDelete = $filesToDelete | Select-Object -Unique

if (-not $filesToDelete -or $filesToDelete.Count -eq 0) {
    Write-Host "No files found to delete after filtering."
    exit
}

# Output files to be deleted
Write-Host "`nThe following files will be deleted:"
foreach ($file in $filesToDelete) {
    Write-Host "- $file"
}

Write-Host "`nSafelist (these files will be preserved):"
foreach ($file in $safelist) {
    Write-Host "- $file"
}

Write-Host "`nContact form related files to be preserved:"
foreach ($pattern in $preservePatterns) {
    Write-Host "- Files matching: $pattern"
}

# Prompt for confirmation
$confirmation = Read-Host "`nDo you want to proceed with deletion? (y/n)"
if ($confirmation -eq 'y') {
    foreach ($file in $filesToDelete) {
        $fullPath = Join-Path $baseDir $file
        if (Test-Path $fullPath) {
            Remove-Item -Path $fullPath -Force
            Write-Host "Deleted: $file"
        }
    }
    Write-Host "Deletion complete"
} else {
    Write-Host "Operation cancelled"
}
