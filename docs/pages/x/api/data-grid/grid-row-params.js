import * as React from 'react';
import InterfaceApiPage from 'docs/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import translation from 'docs/translations/api-docs/data-grid/grid-row-params.json';
import jsonPageContent from './grid-row-params.json';

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
