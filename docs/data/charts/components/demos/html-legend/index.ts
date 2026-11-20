import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HtmlLegend from './HtmlLegend';
import ClientProvider from './client';

export default createDemo(import.meta.url, HtmlLegend, { ClientProvider });
