#!/bin/bash
#
# MUI-X Release Preparation Script
#
# This script automates the release preparation process for MUI-X:
# 1. Updating the git upstream/master branch
# 2. Determining the new version (patch/minor/major or custom)
# 3. Creating a new branch with the new version
# 4. Updating the root package.json with the new version
# 5. Running the lerna version script to update all package versions
# 6. Generating the changelog with actual package versions
# 7. Adding the new changelog entry to the CHANGELOG.md file
# 8. Waiting for user confirmation to review changes
# 9. Committing the changes to the branch
# 10. Opening a PR with a title "[release] v<NEW_VERSION>" and label "release"
#     with a checklist of all release steps
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

# Generate the changelog
echo "Generating changelog..."
CHANGELOG_CONTENT=$(node scripts/releaseChangelog.mjs --githubToken=$GITHUB_TOKEN --nextVersion=$NEW_VERSION --returnEntry)

# Add the new changelog entry to the CHANGELOG.md file
echo "Adding changelog entry to CHANGELOG.md..."
# Find the position of the first version entry (currently ## 8.5.1)
FIRST_VERSION_LINE=$(grep -n "^## [0-9]" CHANGELOG.md | head -1 | cut -d: -f1)

# Create a temporary file with the new content
head -n 7 CHANGELOG.md > temp_changelog.md  # Keep the header (first 7 lines)
echo "$CHANGELOG_CONTENT" >> temp_changelog.md
tail -n +$FIRST_VERSION_LINE CHANGELOG.md >> temp_changelog.md

# Replace the original file
mv temp_changelog.md CHANGELOG.md

echo "Changelog updated. Please review the changes."

# Wait for user confirmation
read -p "Press Enter to continue after reviewing the changes, or Ctrl+C to abort..."

# Commit the changes
echo "Committing changes..."
git add package.json CHANGELOG.md packages/*/package.json
git commit -m "[release] v$NEW_VERSION"

echo "Changes committed to branch $BRANCH_NAME"

# Create PR body with checklist
PR_BODY="Release version $NEW_VERSION

### Prepare the release of the packages

- [x] Compare the last tag with the branch upon which you want to release
- [x] Clean the generated changelog
- [x] Update the root package.json's version
- [x] Update the versions of the other package.json files
- [x] Open PR with changes and wait for review and green CI
- [ ] Once CI is green and you have enough approvals, send a message on the team-x slack channel announcing a merge freeze
- [ ] Merge PR

### Release the packages

- [ ] Checkout the last version of the working branch
- [ ] Run \`pnpm i && pnpm release:build\`
- [ ] Run \`pnpm release:publish\`
- [ ] Run \`pnpm release:tag\`

### Publish the documentation

- [ ] Run \`pnpm docs:deploy\`

### Publish GitHub release

- [ ] Create a new release on GitHub releases page

### Announce

- [ ] Follow the instructions in https://mui-org.notion.site/Releases-7490ef9581b4447ebdbf86b13164272d
"

# Open a PR
echo "Opening a PR..."
# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it to automatically create a PR."
    echo "You can manually create a PR with title: [release] v$NEW_VERSION and label: release"
    echo "Branch: $BRANCH_NAME"
    echo "Use the following checklist in the PR body:"
    echo "$PR_BODY"
else
    gh pr create --title "[release] v$NEW_VERSION" --body "$PR_BODY" --label "release" --repo "mui/mui-x"
    echo "PR created successfully!"
fi

echo "Release preparation completed!"
