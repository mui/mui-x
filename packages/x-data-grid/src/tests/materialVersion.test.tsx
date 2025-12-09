import materialPackageJson from '@mui/material/package.json';
import { checkMaterialVersion } from 'test/utils/checkMaterialVersion';
import packageJson from '../../package.json';

checkMaterialVersion({ packageJson, materialPackageJson });
