import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import translation from 'docs/translations/api-docs/charts/chart-print-export-options/chart-print-export-options.json';
import jsonPageContent from './chart-print-export-options.json';

export default function Page(props) {
  const { descriptions } = props;
  return <InterfaceApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const descriptions = mapApiPageTranslation(translation);
  return { props: { descriptions } };
}
