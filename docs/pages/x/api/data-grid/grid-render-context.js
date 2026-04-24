import * as React from 'react';
import InterfaceApiPage from 'docs/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import { mapApiPageTranslations } from '@mui/internal-core-docs/mapApiPageTranslations';
import jsonPageContent from './grid-render-context.json';

export default function Page(props) {
  const { descriptions } = props;
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />
  );
}

export async function getStaticProps() {
  const req = require.context(
    'docs/translations/api-docs/data-grid/',
    false,
    /\.\/grid-render-context.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);
  return { props: { descriptions } };
}
