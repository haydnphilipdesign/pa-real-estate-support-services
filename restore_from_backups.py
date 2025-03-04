#!/usr/bin/env python3
from pathlib import Path
import shutil
import sys

def restore_from_backup(file_path: Path) -> bool:
    """
    Restores a file from its .bak backup if it exists.
    Returns True if restoration was successful, False otherwise.
    """
    backup_path = file_path.with_suffix(file_path.suffix + ".bak")
    if backup_path.exists():
        try:
            shutil.copy2(backup_path, file_path)
            backup_path.unlink()  # Remove the backup file after successful restore
            print(f"✓ Restored: {file_path}")
            return True
        except Exception as e:
            print(f"✗ Failed to restore {file_path}: {e}")
            return False
    return False

def main():
    # Assume script is run from project root
    base_dir = Path.cwd()
    
    # Find all .bak files recursively
    backup_files = list(base_dir.rglob("*.bak"))
    
    if not backup_files:
        print("No backup files found.")
        sys.exit(0)
    
    print(f"Found {len(backup_files)} backup files.")
    
    # Ask for confirmation
    response = input("Do you want to restore all files from backups? (y/n): ")
    if response.lower() != 'y':
        print("Operation cancelled.")
        sys.exit(0)
    
    # Restore files
    restored_count = 0
    failed_count = 0
    
    for backup_file in backup_files:
        original_file = backup_file.with_suffix('')  # Remove .bak extension
        if restore_from_backup(original_file):
            restored_count += 1
        else:
            failed_count += 1
    
    # Print summary
    print("\nRestore operation completed:")
    print(f"✓ Successfully restored: {restored_count} files")
    if failed_count > 0:
        print(f"✗ Failed to restore: {failed_count} files")

if __name__ == "__main__":
    main()