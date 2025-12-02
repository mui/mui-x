import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './pivot-panel-trigger.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/data-grid/pivot-panel-trigger',
    false,
    /\.\/pivot-panel-trigger.*\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
