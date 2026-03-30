# @mui/x-telemetry

Package used by some of MUI X to collect **anonymous** telemetry data about general usage during development. Telemetry is **enabled by default** in development mode and is completely removed in production builds. Participation in this anonymous program is optional, and you may opt out if you'd not like to share any information.

## How to configure telemetry

Telemetry is **enabled by default** in development mode. You can enable or disable it in any of the following ways:

1. By setting the environment variable.

```dotenv
MUI_X_TELEMETRY_DISABLED=true # Disable telemetry
# or
MUI_X_TELEMETRY_DISABLED=false # Enable telemetry
```

> ⚠️ Note that some frameworks require prefixing the variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

2. By using the package settings on application start (for example, in the main file).

```js
import { muiXTelemetrySettings } from '@mui/x-telemetry';
// or
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.enableTelemetry(); // to enable telemetry collection and sending
// or
muiXTelemetrySettings.disableTelemetry(); // to disable telemetry collection and sending
```

3. By setting the flag on the global object on application start (for example, in the main file).

```js
globalThis.__MUI_X_TELEMETRY_DISABLED__ = false; // enabled
// or
globalThis.__MUI_X_TELEMETRY_DISABLED__ = true; // disabled
```

## How to test

### Postinstall output

The postinstall script writes to two places:

1. **`<pkg-root>/context.js` + `<pkg-root>/context.mjs`** — all traits (`machineId`, `repoHash`, `packageNameHash`, `rootPathHash`, `projectId`, `anonymousId`, `sessionId`, `isDocker`, `isCI`). Lives inside `node_modules` and gets regenerated on each install.
2. **Platform-specific config directory** — persists `anonymousId` and `notifiedAt` across reinstalls, so the `anonymousId` stays stable even if `node_modules` is wiped.
   - **macOS:** `~/Library/Preferences/mui-x/config.json`
   - **Windows:** `%APPDATA%\mui-x\Config\config.json`
   - **Linux:** `$XDG_CONFIG_HOME/mui-x/config.json` (defaults to `~/.config/mui-x/config.json`)
   - **CI/Docker:** `<cwd>/cache/mui-x/config.json` (ephemeral, inside the project)

### Testing the postinstall locally

```bash
# 1. Build the package
pnpm --filter @mui/x-telemetry run build

# 2. Clean previous output (start fresh)
rm -f packages/x-telemetry/build/context.js packages/x-telemetry/build/context.mjs ~/Library/Preferences/mui-x/config.json

# 3. Run the postinstall script

# Local (macOS/Linux)
node packages/x-telemetry/build/postinstall/index.js

# Docker
docker run --rm -v $(pwd):/repo -w /repo/packages/x-telemetry/build node:20 node ./postinstall/index.mjs

# 4. Verify the output
cat packages/x-telemetry/build/context.js   # CJS context
cat packages/x-telemetry/build/context.mjs  # ESM context
cat ~/Library/Preferences/mui-x/config.json # Persistent config (macOS)
```

### Testing the package.json name fallback (no git)

```bash
# 1. Build the package
pnpm --filter @mui/x-telemetry run build

# 2. Create a temp directory with only a package.json (no .git)
mkdir -p /tmp/test-pkg && echo '{"name": "my-test-app"}' > /tmp/test-pkg/package.json

# 3. Clean previous output
rm -f packages/x-telemetry/build/context.js packages/x-telemetry/build/context.mjs

# 4. Run postinstall from the temp directory
cd /tmp/test-pkg && node /path/to/mui-x/packages/x-telemetry/build/postinstall/index.js

# 5. Verify packageNameHash and projectId match sha256("my-test-app")
grep -E 'packageNameHash|projectId' /path/to/mui-x/packages/x-telemetry/build/context.js
echo -n "my-test-app" | shasum -a 256
# packageNameHash and projectId should both match the hash

# 6. Go back to the repo and clean up
cd /path/to/mui-x
rm -rf /tmp/test-pkg
```

### Testing the runtime fallback (npm_package_name)

```bash
# 1. Build the package
pnpm --filter @mui/x-telemetry run build

# 2. Run with npm_package_name set (simulates npm/pnpm run context)
node -e "
  process.env.npm_package_name = 'my-test-app';
  import('./packages/x-telemetry/build/runtime/get-context.mjs').then(m =>
    m.default().then(ctx => {
      console.log('packageNameHash:', ctx.traits.packageNameHash);
      console.log('projectId:', ctx.traits.projectId);
    })
  );
"

# 3. Verify both match sha256("my-test-app")
echo -n "my-test-app" | shasum -a 256
# packageNameHash and projectId should both output: 04a0c785...
```

### Testing the runtime fallback (browser fetch)

```bash
# 1. Create a temp directory with a package.json
mkdir -p /tmp/test-fetch && cd /tmp/test-fetch
echo '{"name": "fetch-test-app"}' > package.json

# 2. Create an index.html that simulates the runtime fetch fallback
cat > index.html << 'HTMLEOF'
<script type="module">
  async function hashString(str) {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const res = await fetch('/package.json');
  const pkg = await res.json();
  const projectId = await hashString(pkg.name);
  console.log('projectId:', projectId);
  document.body.innerText = 'projectId: ' + projectId;
</script>
HTMLEOF

# 3. Serve and open http://localhost:3000
npx serve .

# 4. Verify the browser console output matches sha256("fetch-test-app")
echo -n "fetch-test-app" | shasum -a 256
# Both should output: 1dcce451...

# 5. Clean up
rm -rf /tmp/test-fetch
```

### Unit tests

```bash
pnpm test:unit --project "x-telemetry" --run
```
