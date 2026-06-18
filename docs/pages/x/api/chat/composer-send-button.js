import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import { mapApiPageTranslation } from '@mui/internal-core-docs/mapApiPageTranslations';
import translation from 'docs/translations/api-docs/chat/composer-send-button/composer-send-button.json';
import jsonPageContent from './composer-send-button.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const descriptions = mapApiPageTranslation(translation);

  return { props: { descriptions } };
}
