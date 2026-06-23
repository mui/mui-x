import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import { mapApiPageTranslations } from '@mui/internal-core-docs/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './data-grid-pro.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/data-grid/data-grid-pro',
    false,
    /\.\/data-grid-pro.*\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
