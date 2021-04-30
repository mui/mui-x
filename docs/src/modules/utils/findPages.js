import path from 'path';
import { findPages } from 'docsx/src/modules/utils/find';

const pages = findPages({ front: true }, path.resolve(__dirname, 'api-docs'));

export default pages;
