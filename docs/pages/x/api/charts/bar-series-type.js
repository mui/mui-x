import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './bar-series-type.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={pageContent} />
  );
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/charts/',
    false,
    /\.\/bar-series-type.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    props: {
      descriptions,
      pageContent: jsonPageContent,
    },
  };
}
