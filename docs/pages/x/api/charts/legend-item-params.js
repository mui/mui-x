import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import translation from 'docs/translations/api-docs/charts/legend-item-params/legend-item-params.json';
import jsonPageContent from './legend-item-params.json';

export default function Page(props) {
  const { descriptions } = props;
  return <InterfaceApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const descriptions = mapApiPageTranslation(translation);
  return { props: { descriptions } };
}
