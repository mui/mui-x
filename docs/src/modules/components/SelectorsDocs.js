/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { MarkdownElement } from '@mui/docs/MarkdownElement';
import allSelectors from 'docsx/pages/x/api/data-grid/selectors.json';

const SelectorDetails = styled(AccordionDetails)({
  display: 'block',
});

const SelectorName = styled(Typography)({
  fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
});

const SelectorDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
}));

export const SelectorExample = styled(HighlightedCode)(({ theme }) => ({
  '& pre': {
    marginBottom: theme.spacing(1),
  },
}));

const SELECTOR_NAME_PATTERN = /^grid(.*)Selector/;

function SelectorAccordion({ selector }) {
  let signature = `${selector.name}: (state: GridState) => ${selector.returnType}`;
  if (selector.supportsApiRef) {
    signature = [
      `${selector.name}: (apiRef: GridApiRef) => ${selector.returnType}`,
      '// or',
      `${selector.name}: (state: GridState, instanceId?: number) => ${selector.returnType}`,
    ].join('\n');
  }

  const match = selector.name.match(SELECTOR_NAME_PATTERN);
  const valueName =
    match == null ? 'value' : `${match[1][0].toLocaleLowerCase()}${match[1].slice(1)}`;

  let example = `const ${valueName} = ${selector.name}(apiRef.current.state);`;
  if (selector.supportsApiRef) {
    example = [
      `${selector.name}(apiRef)`,
      '// or',
      `${selector.name}(state, apiRef.current.instanceId)`,
    ].join('\n');
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`api-property-${selector.name}-content`}
        id={`api-property-${selector.name}-header`}
        sx={{
          [`& .${accordionSummaryClasses.content}`]: {
            flexDirection: 'column',
          },
        }}
      >
        <SelectorName variant="subtitle2">{selector.name}</SelectorName>
        <SelectorDescription
          variant="caption"
          dangerouslySetInnerHTML={{ __html: selector.description }}
        />
      </AccordionSummary>
      <SelectorDetails>
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography variant="subtitle2">Signature:</Typography>
        <SelectorExample code={signature} language="tsx" />
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Typography variant="subtitle2">Example</Typography>
        <SelectorExample code={example} language="tsx" />
      </SelectorDetails>
    </Accordion>
  );
}

function SelectorCategoryDocs(props) {
  const { selectors, ...other } = props;

  return (
    <Box {...other}>
      {selectors.map((selector) => (
        <SelectorAccordion key={selector.name} selector={selector} />
      ))}
    </Box>
  );
}

export default function SelectorsDocs(props) {
  const { category } = props;

  if (category) {
    return (
      <MarkdownElement sx={{ width: '100%', mb: 2 }}>
        <SelectorCategoryDocs
          selectors={allSelectors.filter((selector) => selector.category === category)}
        />
      </MarkdownElement>
    );
  }

  const selectors = {};
  allSelectors.forEach((selector) => {
    if (selector.category) {
      if (!selectors[selector.category]) {
        selectors[selector.category] = [];
      }

      selectors[selector.category].push(selector);
    }
  });

  return (
    <MarkdownElement sx={{ width: '100%', mb: 3 }}>
      {Object.entries(selectors).map(([categoryName, categorySelectors]) => (
        <React.Fragment key={categoryName}>
          <Typography variant="h4" sx={(theme) => ({ mb: theme.spacing(2) })}>
            {categoryName}
          </Typography>
          <SelectorCategoryDocs
            selectors={categorySelectors}
            sx={(theme) => ({ '&:not(:last-child)': { mb: theme.spacing(3) } })}
          />
        </React.Fragment>
      ))}
    </MarkdownElement>
  );
}
