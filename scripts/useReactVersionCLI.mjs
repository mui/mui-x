import { setReactVersion } from '@mui/monorepo/scripts/useReactVersion.mjs';
import { getWorkspaceRoot } from './utils.mjs';

const [version = process.env.REACT_VERSION] = process.argv.slice(2);
setReactVersion(version, {
  workspaceRoot: getWorkspaceRoot(),
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
