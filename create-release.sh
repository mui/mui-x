#!/bin/bash
#
# MUI-X Release Preparation Script
#
# This script automates the release preparation process for MUI-X:
# 1. Asking for the major version to update (v7.x, v6.x, etc.)
# 2. Updating the git upstream branch
# 3. Determining the new version (patch/minor/major or custom)
# 4. Creating a new branch from upstream/vX.x and setting up tracking with origin/release/vX
# 5. Updating the root package.json with the new version
# 6. Running the lerna version script to update all package versions
# 7. Generating the changelog with actual package versions
# 8. Adding the new changelog entry to the CHANGELOG.md file
# 9. Waiting for user confirmation to review changes
# 10. Committing the changes to the branch
# 11. Opening a PR with a title "[release] v<NEW_VERSION>" and label "release"
#     with a checklist of all release steps
#
# Usage:
#   bash create-release.sh --patch
#   bash create-release.sh --minor
#   bash create-release.sh --major
#   bash create-release.sh --custom 8.5.2
#   bash create-release.sh (interactive mode with selection menu)
#
# Usage with pnpm is also possible
#   pnpm create-release --patch
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
    if [[ "$line" =~ :mui/mui-x(\.git)?[[:space:]]+\(push\) ]]; then
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
MAJOR_VERSION=""

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

# Function to prompt for the major version to update
select_major_version() {
  # Get current major version from package.json
  CURRENT_MAJOR_VERSION=$(node -e "console.log(require('./package.json').version.split('.')[0])")
  CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
  echo "Current major version: ${CURRENT_VERSION}"

  echo "Please select the major version you are trying to update:"

  local selection
  while true; do
    echo -n "Enter the major version (default: ${CURRENT_MAJOR_VERSION}): "
    read selection
    if [[ -z "$selection" ]]; then
      selection="$CURRENT_MAJOR_VERSION"
    fi

    if ! [[ "$selection" =~ ^[0-9]+$ ]]; then
      echo "Error: Major version must be a number"
      continue
    fi

    # Disallow versions above the current major version
    if [[ "$selection" -gt "$CURRENT_MAJOR_VERSION" ]]; then
      echo "Error: Cannot select a major version (${selection}) higher than the current major version (${CURRENT_MAJOR_VERSION})"
      continue
    fi

    MAJOR_VERSION="$selection"
    echo "Selected major version: ${MAJOR_VERSION}"
    break
  done
}

# Function to display a select-like menu
select_version_type() {
  # Fetch the latest tag for the selected major version
  echo "Fetching latest tag for major version ${MAJOR_VERSION}..."

  # Calculate versions from git tags
  if calculate_versions_from_tags; then
    # Use the calculated versions
    local next_patch="$NEXT_PATCH_VERSION"
    local next_minor="$NEXT_MINOR_VERSION"
    local next_major="$NEXT_MAJOR_VERSION"
  else
    # Use generic placeholders if no tags found
    local next_patch="x.x.X"
    local next_minor="x.X.0"
    local next_major="X.0.0"
  fi

  echo "Please select the version type:"
  echo "1) Patch (${next_patch})"
  echo "2) Minor (${next_minor})"
  echo "3) Major (${next_major})"
  echo "4) Custom version"

  local selection
  while true; do
    echo -n "Enter your choice (1-4, default: 1 for patch): "
    read selection
    if [[ -z "$selection" ]]; then
      selection="1"
      echo "Using default: Patch"
    fi
    case $selection in
      1)
        VERSION_TYPE="patch"
        # Store the calculated next patch version
        CALCULATED_VERSION="$next_patch"
        echo "Selected: Patch (${CALCULATED_VERSION})"
        break
        ;;
      2)
        VERSION_TYPE="minor"
        # Store the calculated next minor version
        CALCULATED_VERSION="$next_minor"
        echo "Selected: Minor (${CALCULATED_VERSION})"
        break
        ;;
      3)
        VERSION_TYPE="major"
        # Store the calculated next major version
        CALCULATED_VERSION="$next_major"
        echo "Selected: Major (${CALCULATED_VERSION})"
        break
        ;;
      4)
        # Use the calculated next patch version as default for custom
        if [[ -n "$NEXT_PATCH_VERSION" ]]; then
          # Use the calculated next patch version from tags
          DEFAULT_CUSTOM_VERSION="$NEXT_PATCH_VERSION"
        else
          # If no tags were found, fall back to calculating from package.json
          IFS='.' read -r DEFAULT_MAJOR DEFAULT_MINOR DEFAULT_PATCH <<< "$CURRENT_VERSION"
          DEFAULT_CUSTOM_VERSION="${DEFAULT_MAJOR}.${DEFAULT_MINOR}.$((DEFAULT_PATCH + 1))"
        fi

        echo -n "Enter custom version (default: ${DEFAULT_CUSTOM_VERSION}): "
        read CUSTOM_VERSION
        if [[ -z "$CUSTOM_VERSION" ]]; then
          CUSTOM_VERSION="$DEFAULT_CUSTOM_VERSION"
          echo "Using default custom version: ${CUSTOM_VERSION}"
        fi
        echo "Selected: Custom version ${CUSTOM_VERSION}"
        break
        ;;
      *)
        echo "Invalid selection. Please enter a number between 1 and 4."
        ;;
    esac
  done
}

# Always prompt for major version first
select_major_version

# Function to calculate versions from git tags
calculate_versions_from_tags() {
  # Get all tags matching the selected major version
  local tags=$(git tag -l "v${MAJOR_VERSION}.*" | sort -V)

  # Find the latest tag
  local latest_tag=$(echo "$tags" | tail -n 1)

  if [[ -z "$latest_tag" ]]; then
    echo "Warning: No tags found for major version ${MAJOR_VERSION}"
    echo "Will calculate versions from package.json instead"
    return 1
  fi

  echo "Latest tag: ${latest_tag}"

  # Remove the 'v' prefix
  local version_without_v=${latest_tag#v}

  # Split the version into components
  IFS='.' read -r tag_major tag_minor tag_patch <<< "$version_without_v"

  # Calculate next versions
  NEXT_PATCH_VERSION="${tag_major}.${tag_minor}.$((tag_patch + 1))"
  NEXT_MINOR_VERSION="${tag_major}.$((tag_minor + 1)).0"
  NEXT_MAJOR_VERSION="$((tag_major + 1)).0.0"

  return 0
}

# Validate arguments
if [[ -z "$VERSION_TYPE" && -z "$CUSTOM_VERSION" ]]; then
  # No arguments provided, use interactive menu
  select_version_type
else
  # Command-line arguments provided, calculate versions from tags
  calculate_versions_from_tags

  # If a version type was specified, set the calculated version
  if [[ -n "$VERSION_TYPE" ]]; then
    if [[ "$VERSION_TYPE" == "patch" && -n "$NEXT_PATCH_VERSION" ]]; then
      CALCULATED_VERSION="$NEXT_PATCH_VERSION"
      echo "Using calculated patch version: ${CALCULATED_VERSION}"
    elif [[ "$VERSION_TYPE" == "minor" && -n "$NEXT_MINOR_VERSION" ]]; then
      CALCULATED_VERSION="$NEXT_MINOR_VERSION"
      echo "Using calculated minor version: ${CALCULATED_VERSION}"
    elif [[ "$VERSION_TYPE" == "major" && -n "$NEXT_MAJOR_VERSION" ]]; then
      CALCULATED_VERSION="$NEXT_MAJOR_VERSION"
      echo "Using calculated major version: ${CALCULATED_VERSION}"
    fi
  fi
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
elif [[ -n "$CALCULATED_VERSION" ]]; then
  # Use the calculated version from git tags if available
  NEW_VERSION="$CALCULATED_VERSION"
else
  # Fall back to calculating from package.json if no calculated version is available
  # (This happens when version type is specified via command line arguments)
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

# Determine which branch to update based on the selected major version
if [[ "$MAJOR_VERSION" == "$CURRENT_MAJOR_VERSION" ]]; then
  echo "Updating the upstream master branch for current major version..."
  git fetch $UPSTREAM_REMOTE master
else
  echo "Updating the upstream v${MAJOR_VERSION}.x branch..."
  git fetch $UPSTREAM_REMOTE v${MAJOR_VERSION}.x
fi

# Check for uncommitted changes
while [ -n "$(git status --porcelain)" ]; do
  echo "Warning: You have uncommitted changes."
  echo "Please commit or stash your changes before continuing."
  echo "You can run:"
  echo "  git add . && git commit -m 'Your commit message'"
  echo "  or"
  echo "  git stash"
  echo "in another terminal window."
  echo -n "Press Enter to check again, or Ctrl+C to abort... "
  read
done

# Create a new branch with the new version
BRANCH_NAME="release/v$NEW_VERSION-$(date '+%Y%m%d%H%M%S')"
echo "Creating new branch: $BRANCH_NAME"
# Determine the source branch based on the selected major version
if [[ "$MAJOR_VERSION" == "$CURRENT_MAJOR_VERSION" ]]; then
  BRANCH_SOURCE="$UPSTREAM_REMOTE/master"
  echo "Creating branch from master for current major version: $BRANCH_SOURCE"
else
  BRANCH_SOURCE="$UPSTREAM_REMOTE/v${MAJOR_VERSION}.x"
  echo "Creating branch from version branch: $BRANCH_SOURCE"
fi
git checkout -b $BRANCH_NAME --no-track $BRANCH_SOURCE
# Push to origin and set up tracking with origin/release/vX
echo "Pushing branch to origin and setting up tracking..."
git push -u origin $BRANCH_NAME

# Update package.json
echo "Updating root package.json..."
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
head -n $(($FIRST_VERSION_LINE-1)) CHANGELOG.md > temp_changelog.md
echo "$CHANGELOG_CONTENT" >> temp_changelog.md
tail -n +$FIRST_VERSION_LINE CHANGELOG.md >> temp_changelog.md

# Replace the original file
mv temp_changelog.md CHANGELOG.md

echo "Changelog updated. Please review the changes."

# Wait for user confirmation
echo -n "Press Enter to continue after reviewing the changes, or Ctrl+C to abort... "
read

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
