import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import translation from 'docs/translations/api-docs/data-grid/prompt-field-send/prompt-field-send.json';
import jsonPageContent from './prompt-field-send.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const descriptions = mapApiPageTranslation(translation);

  return { props: { descriptions } };
}
