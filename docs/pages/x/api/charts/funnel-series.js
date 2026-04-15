import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import { mapApiPageTranslations } from '@mui/internal-core-docs/mapApiPageTranslations';
import jsonPageContent from './funnel-series.json';

export default function Page(props) {
  const { descriptions } = props;
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />
  );
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/charts/',
    false,
    /\.\/funnel-series.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);
  return { props: { descriptions } };
}
