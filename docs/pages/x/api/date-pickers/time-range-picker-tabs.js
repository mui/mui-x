import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './time-range-picker-tabs.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/date-pickers/time-range-picker-tabs',
    false,
    /\.\/time-range-picker-tabs.*\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
