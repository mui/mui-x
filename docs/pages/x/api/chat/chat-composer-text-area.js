import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import { mapApiPageTranslations } from '@mui/internal-core-docs/mapApiPageTranslations';
import jsonPageContent from './chat-composer-text-area.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docs/translations/api-docs/chat/chat-composer-text-area',
    false,
    /\.\/chat-composer-text-area.*\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
