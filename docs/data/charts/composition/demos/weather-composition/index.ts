import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import WeatherComposition from './WeatherComposition';
import ClientProvider from './client';

export default createDemo(import.meta.url, WeatherComposition, { ClientProvider });
