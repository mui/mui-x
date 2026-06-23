import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import translation from 'docs/translations/api-docs/data-grid/grid-print-export-options/grid-print-export-options.json';
import jsonPageContent from './grid-print-export-options.json';

export default function Page(props) {
  const { descriptions } = props;
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />
  );
}

export async function getStaticProps() {
  const descriptions = mapApiPageTranslation(translation);
  return { props: { descriptions } };
}
