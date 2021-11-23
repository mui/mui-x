import React from 'react';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const SelectorDocsRoot = styled('div')({
  width: '100%',
});

const SelectorDetails = styled(AccordionDetails)({
  display: 'block',
});

const SelectorName = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
  WebkitFontSmoothing: 'subpixel-antialiased',
}));

const SelectorDescription = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  marginBottom: theme.spacing(2),
}));

export const SelectorExample = styled(HighlightedCode)(({ theme }) => ({
  '& pre': {
    marginBottom: theme.spacing(1),
  },
}));

function SelectorsDocs(props) {
  const { selectors } = props;

  return (
    <SelectorDocsRoot>
      {selectors.map((selector, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`api-property-${index}-content`}
            id={`api-property-${index}-header`}
          >
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <SelectorName>{selector.name}</SelectorName>
          </AccordionSummary>
          <SelectorDetails>
            <SelectorDescription dangerouslySetInnerHTML={{ __html: selector.description }} />
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <Typography variant="subtitle2">Signature:</Typography>
            <SelectorExample
              code={`${selector.name}: (state: GridState) => ${selector.returnType}`}
              language="tsx"
            />
          </SelectorDetails>
        </Accordion>
      ))}
    </SelectorDocsRoot>
  );
}

SelectorsDocs.propTypes = {
  selectors: PropTypes.array.isRequired,
};

export default SelectorsDocs;
