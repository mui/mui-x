import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import { mapApiPageTranslations } from '@mui/internal-core-docs/mapApiPageTranslations';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './toolbar.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docs/translations/api-docs/data-grid/toolbar',
    false,
    /\.\/toolbar.*\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
