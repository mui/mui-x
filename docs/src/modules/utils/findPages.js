import path from 'path';
import { findPages } from 'docs/src/modules/utils/find';

const pages = findPages(
  {
    front: true,
  },
  path.resolve(__dirname, '../node_modules/@material-ui/monorepo/docs/pages'),
);

export default pages;
