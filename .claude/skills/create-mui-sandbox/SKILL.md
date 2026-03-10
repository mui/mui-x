---
name: create-mui-sandbox
description: Create a StackBlitz sandbox with MUI dependencies to quickly prototype MUI components or reproduce issues.
---

## 1. Determine Requirements

**Before doing anything else:**

- Check if user wants a **shareable URL** → sets `--no-open` flag later
- Check if user provides a **PR** (URL or number) → use PR packages (see [PR Packages](#pr-packages))
- Identify which MUI packages to include:
  - `@mui/material` (always)
  - `@mui/icons-material` (if icons mentioned)
  - `@mui/x-data-grid` (if Data Grid mentioned)
  - `@mui/x-date-pickers` (if Date Pickers mentioned)
  - `@mui/x-charts` (if Charts mentioned)
  - `@mui/x-tree-view` (if Tree View mentioned)

## 2. MUI X License

Do NOT call `LicenseInfo.setLicenseKey()`. Sandbox users don't have license keys — just let the watermark show.

## 3. Create Demo Code

Write `src/Demo.tsx`:

- Use `using-mui-components` skill for quality MUI code
- Must have default export
- Add extra MUI packages to `dependencies` in package.json if needed

## 4. Build Config & Execute

Build JSON config with all files (see [File Templates](#file-templates) below).

Write config using Bash heredoc (avoids Write tool "file not read" error):

```bash
cat > /tmp/stackblitz-config.json << 'EOF'
{ ... }
EOF
```

Run script — if user wants shareable URL, use `--no-open`:

```bash
# If user wants shareable URL:
python3 <skill-dir>/create-stackblitz.py /tmp/stackblitz-config.json --no-open

# Otherwise (opens in browser):
python3 <skill-dir>/create-stackblitz.py /tmp/stackblitz-config.json
```

Resolve `<skill-dir>` from where this file was loaded.

## 5. Post-execution

### If shareable URL requested

**4.1** Check if `agent-browser` is installed:

```bash
command -v agent-browser
```

**4.2** If NOT installed, ask user via AskUserQuestion:

- Question: "agent-browser is required for shareable URLs but not installed. Install it?"
- Options: "Yes, install it" / "No, I'll click Fork manually"

If yes, run:

```bash
npm install -g agent-browser && agent-browser install
```

If no, open sandbox normally and inform user to click Fork button.

**4.3** If installed, run the fork workflow:

**IMPORTANT:** `agent-browser` prepends `https://` to URLs, breaking `file://`. You MUST use local HTTP server.

```bash
# Get the HTML file path from script output (e.g., /var/folders/.../stackblitz-XXXXX.html)
HTML_FILE="stackblitz-XXXXX.html"
TEMP_DIR="/var/folders/.../T"  # directory containing the HTML file

# Kill any existing server on port 8765
lsof -ti:8765 | xargs kill -9 2>/dev/null || true

# Start local server
python3 -m http.server 8765 --directory "$TEMP_DIR" &
SERVER_PID=$!

# Verify server is running
sleep 1
curl -s -o /dev/null http://localhost:8765/ || { echo "Server failed"; kill $SERVER_PID 2>/dev/null; exit 1; }

# Open in agent-browser (NEVER use file:// URLs)
agent-browser open "http://localhost:8765/$HTML_FILE"

# Wait for StackBlitz to load
agent-browser wait 5000

# Find and click Fork button
agent-browser snapshot -i  # Look for 'button "Fork"'
agent-browser click "@eN"  # Replace @eN with actual ref from snapshot

# Get forked URL
sleep 5
FORKED_URL=$(agent-browser get url)
# Output: https://stackblitz.com/edit/<project-id>?file=src%2FDemo.tsx

# Cleanup
agent-browser close
kill $SERVER_PID 2>/dev/null

# Open shareable URL in default browser
open "$FORKED_URL"
```

### If NOT requested

Inform user: "Click the **Fork** button in the sandbox to get a shareable URL."

---

## PR Packages

By default, all MUI dependencies use `"latest"`. When user provides a PR (from `mui/material-ui` or `mui/mui-x`), replace the relevant packages with `pkg.pr.new` URLs.

**Format:** `https://pkg.pr.new/{repo}/{package}@{commit-hash}`

**Steps:**

1. Get the repo and latest commit hash from the PR:
   ```bash
   gh pr view <PR> --repo <repo> --json headRefOid,commits --jq '.commits[-1].oid'
   ```
2. Replace only the packages that belong to the PR's repo. Non-repo packages stay `"latest"`.

**Repo → packages mapping:**

| Repo              | Packages                                                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mui/material-ui` | `@mui/material`, `@mui/icons-material`, `@mui/system`                                                                                                                                                      |
| `mui/mui-x`       | `@mui/x-data-grid`, `@mui/x-data-grid-pro`, `@mui/x-data-grid-premium`, `@mui/x-date-pickers`, `@mui/x-date-pickers-pro`, `@mui/x-charts`, `@mui/x-charts-pro`, `@mui/x-tree-view`, `@mui/x-tree-view-pro` |

Only replace packages actually used in the sandbox. Example for a Data Grid sandbox from `mui/mui-x` PR with commit `abc123`:

```json
{
  "dependencies": {
    "@mui/material": "latest",
    "@mui/x-data-grid": "https://pkg.pr.new/mui/mui-x/@mui/x-data-grid@abc123",
    "react": "latest",
    "react-dom": "latest",
    "@emotion/react": "latest",
    "@emotion/styled": "latest",
    "typescript": "latest"
  }
}
```

---

## File Templates

### Config Structure

```json
{
  "title": "Project Title",
  "description": "Project description",
  "template": "node",
  "initial_file": "src/Demo.tsx",
  "files": {
    "src/Demo.tsx": "...",
    "src/index.tsx": "...",
    "index.html": "...",
    "package.json": "...",
    "tsconfig.json": "...",
    "tsconfig.node.json": "...",
    "vite.config.ts": "..."
  }
}
```

### src/Demo.tsx

User-provided component. Must export default.

### src/index.tsx

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import Demo from './Demo';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Demo />
    </StyledEngineProvider>
  </React.StrictMode>,
);
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>MUI Sandbox</title>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

### package.json

**CRITICAL:** Must include `dependencies` and `devDependencies` with `"latest"` versions. Without these, sandbox won't run.

```json
{
  "private": true,
  "description": "<description>",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mui/material": "latest",
    "react-dom": "latest",
    "react": "latest",
    "@emotion/react": "latest",
    "@emotion/styled": "latest",
    "typescript": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "@types/react-dom": "latest",
    "@types/react": "latest"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env': {} },
});
```
