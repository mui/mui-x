import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const PrimaryHeading = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  flexBasis: '33.33%',
  flexShrink: 0,
  direction: 'ltr',
  lineHeight: 1.4,
  display: 'inline-block',
  fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
  WebkitFontSmoothing: 'subpixel-antialiased',
}));

const SecondaryHeading = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  color: theme.palette.text.secondary,
  '& code': {
    color: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

function ApiDocs(props) {
  const { api } = props;

  return (
    <Box sx={{ width: '100%' }}>
      {api.properties.map((property, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`api-property-${index}-content`}
            id={`api-property-${index}-header`}
          >
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <PrimaryHeading>{`${property.name}()`}</PrimaryHeading>
            <SecondaryHeading dangerouslySetInnerHTML={{ __html: property.description }} />
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'block' }}>
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <Typography variant="subtitle2">Signature:</Typography>
            <HighlightedCode
              code={`${property.name}: ${property.type}`}
              language="tsx"
              sx={{
                '& pre': {
                  mb: 1,
                },
              }}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

ApiDocs.propTypes = {
  api: PropTypes.object.isRequired,
};

export default ApiDocs;
