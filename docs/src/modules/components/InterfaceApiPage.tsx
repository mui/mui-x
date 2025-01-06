/* eslint-disable react/no-danger */
import * as React from 'react';
import PropTypes from 'prop-types';
import { exactProp } from '@mui/utils';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { alpha } from '@mui/material/styles';
import { Translate, useTranslate, useUserLanguage } from '@mui/docs/i18n';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { MarkdownElement } from '@mui/docs/MarkdownElement';
import { SectionTitle, SectionTitleProps } from '@mui/docs/SectionTitle';
import AppLayoutDocs from 'docs/src/modules/components/AppLayoutDocs';
import PropertiesSection from 'docs/src/modules/components/ApiPage/sections/PropertiesSection';
import { PropertyDefinition } from 'docs/src/modules/components/ApiPage/definitions/properties';
import { LayoutStorageKeys } from 'docs/src/modules/components/ApiPage';
import {
  DEFAULT_API_LAYOUT_STORAGE_KEYS,
  ApiDisplayOptions,
} from 'docs/src/modules/components/ApiPage/sections/ToggleDisplayOption';
import {
  InterfaceApiTranslation,
  InterfaceApiContent,
} from 'docsx/scripts/api/buildInterfacesDocumentation';
import { TableOfContentsEntry } from '@mui/internal-markdown';
import kebabCase from 'lodash/kebabCase';

type HeaderHash = 'demos' | 'import';

export function getTranslatedHeader(t: Translate, header: HeaderHash) {
  const translations = {
    demos: t('api-docs.demos'),
    import: t('api-docs.import'),
  };

  return translations[header] || header;
}

function Heading(props: Pick<SectionTitleProps<HeaderHash>, 'hash' | 'level'>) {
  const { hash, level = 'h2' } = props;
  const t = useTranslate();

  return <SectionTitle title={getTranslatedHeader(t, hash)} hash={hash} level={level} />;
}

Heading.propTypes = {
  hash: PropTypes.string.isRequired,
  level: PropTypes.string,
};

interface ApiPageProps {
  descriptions: {
    [lang: string]: InterfaceApiTranslation & {
      // Table of Content added by the mapApiPageTranslations function
      componentDescriptionToc: TableOfContentsEntry[];
    };
  };
  pageContent: InterfaceApiContent;
  defaultLayout?: ApiDisplayOptions;
  /**
   * The localStorage key used to save the user layout for each section.
   * It's useful to dave different preferences on different pages.
   * For example, the Data Grid has a different key that the core.
   */
  layoutStorageKey?: LayoutStorageKeys;
}

interface GetInterfaceApiDefinitionsParams {
  interfaceName: string;
  properties: InterfaceApiContent['properties'];
  propertiesDescriptions: InterfaceApiTranslation['propertiesDescriptions'];
  /**
   * Add indicators that the properties is optional instead of showing it is required.
   */
  showOptionalAbbr?: boolean;
}

export function getInterfaceApiDefinitions(
  params: GetInterfaceApiDefinitionsParams,
): PropertyDefinition[] {
  const { properties, propertiesDescriptions, interfaceName, showOptionalAbbr = false } = params;

  return Object.entries(properties).map(([propertyName, propertyData]) => {
    const isRequired = propertyData.required && !showOptionalAbbr;
    const isOptional = !propertyData.required && showOptionalAbbr;

    const typeName = propertyData.type.description;
    const propDefault = propertyData.default;
    const propDescription = propertiesDescriptions[propertyName];

    return {
      propName: propertyName,
      hash: `${kebabCase(interfaceName)}-prop-${propertyName}`,
      propertyName,
      description: propDescription?.description,
      isOptional,
      isRequired,
      typeName,
      propDefault,
      isProPlan: propertyData.isProPlan,
      isPremiumPlan: propertyData.isPremiumPlan,
    };
  });
}

export default function ApiPage(props: ApiPageProps) {
  const {
    descriptions,
    pageContent,
    defaultLayout = 'expanded',
    layoutStorageKey = DEFAULT_API_LAYOUT_STORAGE_KEYS,
  } = props;
  const t = useTranslate();
  const userLanguage = useUserLanguage();

  const { demos, properties } = pageContent;

  const { propertiesDescriptions, interfaceDescription } = descriptions[userLanguage];
  const description = t('api-docs.interfacePageDescription').replace(/{{name}}/, pageContent.name);

  return (
    <AppLayoutDocs
      description={description}
      disableToc={false}
      toc={[]}
      location=""
      title={`${pageContent.name} API`}
      disableAd
    >
      <MarkdownElement>
        <h1>{pageContent.name} API</h1>
        <Typography
          variant="h5"
          component="p"
          className="description"
          gutterBottom
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <Heading hash="demos" />
        {demos && (
          <Alert
            severity="success"
            variant="outlined"
            icon={<VerifiedRoundedIcon sx={{ fontSize: 20 }} />}
            sx={[
              (theme) => ({
                mt: 1.5,
                pt: 1,
                px: 2,
                pb: 0,
                fontSize: theme.typography.pxToRem(16),
                backgroundColor: (theme.vars || theme).palette.success[50],
                borderColor: (theme.vars || theme).palette.success[100],
                '& * p': {
                  mb: 1,
                },
                '& * a': {
                  fontWeight: theme.typography.fontWeightMedium,
                  color: (theme.vars || theme).palette.success[900],
                  textDecorationColor: alpha(theme.palette.success[600], 0.3),
                },
                ...theme.applyDarkStyles({
                  '& * a': {
                    color: (theme.vars || theme).palette.success[100],
                    textDecorationColor: alpha(theme.palette.success[100], 0.3),
                  },
                  backgroundColor: alpha(theme.palette.success[700], 0.15),
                  borderColor: alpha(theme.palette.success[600], 0.3),
                }),
              }),
            ]}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: `<p>For examples and details on the usage, check the following pages:</p>
              ${demos}`,
              }}
            />
          </Alert>
        )}
        <Heading hash="import" />
        <HighlightedCode
          code={pageContent.imports.join(`
// ${t('or')}
`)}
          language="jsx"
        />

        {interfaceDescription ? (
          <React.Fragment>
            <br />
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: interfaceDescription,
              }}
            />
          </React.Fragment>
        ) : null}

        <PropertiesSection
          properties={getInterfaceApiDefinitions({
            propertiesDescriptions,
            properties,
            interfaceName: pageContent.name,
            showOptionalAbbr: true,
          })}
          title="api-docs.properties"
          titleHash="properties"
          defaultLayout={defaultLayout}
          layoutStorageKey={layoutStorageKey.props}
        />
      </MarkdownElement>
      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="anchor-link-icon" viewBox="0 0 12 6">
          <path d="M8.9176 0.083252H7.1676C6.84677 0.083252 6.58427 0.345752 6.58427 0.666585C6.58427 0.987419 6.84677 1.24992 7.1676 1.24992H8.9176C9.8801 1.24992 10.6676 2.03742 10.6676 2.99992C10.6676 3.96242 9.8801 4.74992 8.9176 4.74992H7.1676C6.84677 4.74992 6.58427 5.01242 6.58427 5.33325C6.58427 5.65409 6.84677 5.91659 7.1676 5.91659H8.9176C10.5276 5.91659 11.8343 4.60992 11.8343 2.99992C11.8343 1.38992 10.5276 0.083252 8.9176 0.083252ZM3.6676 2.99992C3.6676 3.32075 3.9301 3.58325 4.25094 3.58325H7.75094C8.07177 3.58325 8.33427 3.32075 8.33427 2.99992C8.33427 2.67909 8.07177 2.41659 7.75094 2.41659H4.25094C3.9301 2.41659 3.6676 2.67909 3.6676 2.99992ZM4.83427 4.74992H3.08427C2.12177 4.74992 1.33427 3.96242 1.33427 2.99992C1.33427 2.03742 2.12177 1.24992 3.08427 1.24992H4.83427C5.1551 1.24992 5.4176 0.987419 5.4176 0.666585C5.4176 0.345752 5.1551 0.083252 4.83427 0.083252H3.08427C1.47427 0.083252 0.167603 1.38992 0.167603 2.99992C0.167603 4.60992 1.47427 5.91659 3.08427 5.91659H4.83427C5.1551 5.91659 5.4176 5.65409 5.4176 5.33325C5.4176 5.01242 5.1551 4.74992 4.83427 4.74992Z" />
        </symbol>
      </svg>
    </AppLayoutDocs>
  );
}

if (process.env.NODE_ENV !== 'production') {
  ApiPage.propTypes = exactProp({
    defaultLayout: PropTypes.oneOf(['collapsed', 'expanded', 'table']),
    descriptions: PropTypes.object.isRequired,
    layoutStorageKey: PropTypes.shape({
      props: PropTypes.string,
    }),
    pageContent: PropTypes.object.isRequired,
  });
}
