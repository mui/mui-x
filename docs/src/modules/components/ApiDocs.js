import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

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

function PlanIcon({ plan }) {
  let href;
  let title;

  switch (plan) {
    case 'pro':
      href = 'https://mui.com/x/introduction/licensing/#pro-plan';
      title = 'Pro plan';
      break;
    case 'premium':
      href = 'https://mui.com/x/introduction/licensing/#premium-plan';
      title = 'Premium plan';
      break;
    default: {
      return null;
    }
  }
  return (
    <a href={href} title={title} aria-label={title}>
      <span className={`plan-${plan}`} />
    </a>
  );
}

PlanIcon.propTypes = {
  plan: PropTypes.string,
};

function ApiProperty({ index, property, plan }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`api-property-${index}-content`}
        id={`api-property-${index}-header`}
      >
        <PrimaryHeading>
          <React.Fragment>
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            {`${property.name}()`}
            <PlanIcon plan={plan} />
          </React.Fragment>
        </PrimaryHeading>
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
  );
}

ApiProperty.propTypes = {
  index: PropTypes.number.isRequired,
  plan: PropTypes.string,
  property: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

function ApiDocs(props) {
  const { api = null, proApi = null, premiumApi = null } = props;

  return (
    <Box sx={{ width: '100%' }}>
      {api &&
        api.properties.map((property, index) => (
          <ApiProperty key={index} property={property} index={index} />
        ))}
      {proApi &&
        proApi.properties.map((property, index) => (
          <ApiProperty key={index} property={property} index={index} plan="pro" />
        ))}
      {premiumApi &&
        premiumApi.properties.map((property, index) => (
          <ApiProperty key={index} property={property} index={index} plan="premium" />
        ))}
    </Box>
  );
}

ApiDocs.propTypes = {
  api: PropTypes.object,
  premiumApi: PropTypes.object,
  proApi: PropTypes.object,
};

export default ApiDocs;
