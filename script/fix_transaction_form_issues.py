#!/usr/bin/env python3
import re
from pathlib import Path

def backup_file(file_path: Path):
    """
    Creates a backup of the file with a .bak extension for a revert-friendly approach.
    """
    backup_path = file_path.with_suffix(file_path.suffix + ".bak")
    backup_path.write_bytes(file_path.read_bytes())
    print(f"Backup created for {file_path} as {backup_path}")

def fix_use_transaction_form(file_path: Path):
    """
    Checks and fixes the clients array initialization in useTransactionForm.ts.
    If an empty clients array is found, it replaces it with a default object.
    """
    content = file_path.read_text(encoding="utf-8")

    # Look for the empty array for clients. The regex tolerates any whitespace in between.
    pattern = r"(clients\s*:\s*)\[\s*\],"
    # Default structure to be used if an empty clients array is found.
    replacement = ("clients: [{ name: '', address: '', email: '', phone: '', "
                   "maritalStatus: 'Single', designation: '' }],")
    if re.search(pattern, content):
        print(f"[{file_path.name}] Found empty clients array. Applying fix...")
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            backup_file(file_path)
            file_path.write_text(new_content, encoding="utf-8")
            print(f"[{file_path.name}] Clients array initialization updated.")
        else:
            print(f"[{file_path.name}] No changes made after regex substitution.")
    else:
        print(f"[{file_path.name}] No empty clients array pattern found. Skipping fix.")

def check_property_address_onupdate(file_path: Path):
    """
    Checks if the AddressAutocomplete component in PropertySection.tsx has the correct onUpdate handler for 'propertyAddress'.
    """
    content = file_path.read_text(encoding="utf-8")

    # Look for a typical onUpdate call for 'propertyAddress'
    if "onUpdate('propertyAddress'" in content or 'onUpdate("propertyAddress"' in content:
        print(f"[{file_path.name}] onUpdate handler for propertyAddress is present.")
    else:
        print(f"[{file_path.name}] WARN: onUpdate handler for propertyAddress not found. Please review this field.")

def check_sale_price_onblur(file_path: Path):
    """
    Checks if the salePrice field in PropertySection.tsx uses onBlur with a call to onUpdate for salePrice.
    """
    content = file_path.read_text(encoding="utf-8")

    # Check for a reference to handlePriceBlur and ensure onUpdate is used within that function (assumes a simple inline implementation)
    if "handlePriceBlur" in content and ("onUpdate('salePrice'" in content or 'onUpdate("salePrice"' in content):
        print(f"[{file_path.name}] handlePriceBlur for salePrice appears properly implemented.")
    else:
        print(f"[{file_path.name}] WARN: handlePriceBlur or onUpdate for salePrice may be missing or incorrect.")

def main():
    # Assume this script is run from the project root
    base_dir = Path.cwd()

    # Specify the paths to the target files
    files_to_check = {
        "useTransactionForm": base_dir / "src/components/TransactionForm/useTransactionForm.ts",
        "PropertySection": base_dir / "src/components/TransactionForm/sections/PropertySection.tsx",
    }


    # Check and fix useTransactionForm.ts for the clients array initialization
    use_trans_form = files_to_check.get("useTransactionForm")
    if use_trans_form.exists():
        fix_use_transaction_form(use_trans_form)
    else:
        print(f"File not found: {use_trans_form}")

    # Check the onUpdate handlers in PropertySection.tsx for propertyAddress and salePrice fields
    prop_section = files_to_check.get("PropertySection")
    if prop_section.exists():
        check_property_address_onupdate(prop_section)
        check_sale_price_onblur(prop_section)
    else:
        print(f"File not found: {prop_section}")

    print("Script execution completed. Please review the messages above for any warnings.")

if __name__ == "__main__":
    main() 