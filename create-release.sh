#!/bin/bash
#
# MUI-X Version Update Script
#
# This script handles the first part of the release process for MUI-X:
# 1. Updating the git upstream/master branch
# 2. Determining the new version (patch/minor/major or custom)
# 3. Creating a new branch with the new version
# 4. Updating the root package.json with the new version
# 5. Running the lerna version script to update all package versions
#
# Usage:
#   bash create-release.sh --patch
#   bash create-release.sh --minor
#   bash create-release.sh --major
#   bash create-release.sh --custom 8.5.2
#   bash create-release.sh (interactive mode with selection menu)
#
# Note: If the script is made executable (chmod +x create-release.sh),
# you can also run it directly:
#   ./create-release.sh --patch
#   ./create-release.sh (interactive mode)
#
# Requirements:
#   - Must be run from the repository root
#   - Node.js and npm/yarn/pnpm installed
#   - Lerna installed

set -e

# Check if we're in the repository root
if [ ! -f "package.json" ] || [ ! -f "CHANGELOG.md" ]; then
  echo "Error: Please run this script from the repository root."
  exit 1
fi

# Find the remote pointing to mui/mui-x
find_mui_x_remote() {
  local remotes=$(git remote -v)
  local upstream_remote=""

  while IFS= read -r line; do
    if [[ "$line" =~ mui/mui-x(\.git)?[[:space:]]+\(push\) ]]; then
      upstream_remote=$(echo "$line" | awk '{print $1}')
      break
    fi
  done <<< "$remotes"

  if [ -z "$upstream_remote" ]; then
    echo "Error: Unable to find the upstream remote. It should be a remote pointing to 'mui/mui-x'."
    echo "Did you forget to add it via 'git remote add upstream git@github.com:mui/mui-x.git'?"
    exit 1
  fi

  echo "$upstream_remote"
}

# Parse command line arguments
VERSION_TYPE=""
CUSTOM_VERSION=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --patch)
      VERSION_TYPE="patch"
      shift
      ;;
    --minor)
      VERSION_TYPE="minor"
      shift
      ;;
    --major)
      VERSION_TYPE="major"
      shift
      ;;
    --custom)
      if [[ -z "$2" || "$2" == --* ]]; then
        echo "Error: --custom requires a version number"
        exit 1
      fi
      CUSTOM_VERSION="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage:"
      echo "  bash create-release.sh --patch"
      echo "  bash create-release.sh --minor"
      echo "  bash create-release.sh --major"
      echo "  bash create-release.sh --custom 8.5.2"
      echo "  bash create-release.sh (interactive mode with selection menu)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Function to display a select-like menu
select_version_type() {
  echo "Please select the version type:"
  echo "1) Patch (x.x.X)"
  echo "2) Minor (x.X.0)"
  echo "3) Major (X.0.0)"
  echo "4) Custom version"

  local selection
  while true; do
    read -p "Enter your choice (1-4): " selection
    case $selection in
      1)
        VERSION_TYPE="patch"
        break
        ;;
      2)
        VERSION_TYPE="minor"
        break
        ;;
      3)
        VERSION_TYPE="major"
        break
        ;;
      4)
        read -p "Enter custom version (e.g., 8.5.2): " CUSTOM_VERSION
        if [[ -z "$CUSTOM_VERSION" ]]; then
          echo "Error: Custom version cannot be empty"
          continue
        fi
        break
        ;;
      *)
        echo "Invalid selection. Please enter a number between 1 and 4."
        ;;
    esac
  done
}

# Validate arguments
if [[ -z "$VERSION_TYPE" && -z "$CUSTOM_VERSION" ]]; then
  # No arguments provided, use interactive menu
  select_version_type
fi

if [[ -n "$VERSION_TYPE" && -n "$CUSTOM_VERSION" ]]; then
  echo "Error: You cannot specify both a version type and a custom version"
  exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "Current version: $CURRENT_VERSION"

# Calculate new version
if [[ -n "$CUSTOM_VERSION" ]]; then
  NEW_VERSION="$CUSTOM_VERSION"
else
  # Split the version into components
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

  if [[ "$VERSION_TYPE" == "patch" ]]; then
    NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
  elif [[ "$VERSION_TYPE" == "minor" ]]; then
    NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
  elif [[ "$VERSION_TYPE" == "major" ]]; then
    NEW_VERSION="$((MAJOR + 1)).0.0"
  fi
fi

echo "New version: $NEW_VERSION"

# Find the upstream remote
UPSTREAM_REMOTE=$(find_mui_x_remote)
echo "Found upstream remote: $UPSTREAM_REMOTE"

# Update the upstream master branch
echo "Updating the upstream master branch..."
git fetch $UPSTREAM_REMOTE master

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: You have uncommitted changes. Please commit or stash them before running this script."
  exit 1
fi

# Create a new branch with the new version
BRANCH_NAME="release/v$NEW_VERSION"
echo "Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME $UPSTREAM_REMOTE/master

# Update package.json
echo "Updating package.json..."
# Use node to update the package.json file
node -e "
const fs = require('fs');
const packageJson = require('./package.json');
packageJson.version = '$NEW_VERSION';
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
"

echo "Updated package.json version to $NEW_VERSION"

# Run lerna version script
echo "Running lerna version script..."
npx lerna version --exact --no-changelog --no-push --no-git-tag-version --no-private

echo "Version update completed successfully!"
echo "New version: $NEW_VERSION"
