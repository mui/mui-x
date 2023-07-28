import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import BrandingProvider from 'docs/src/BrandingProvider';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import DemoPropsForm from './DemoPropsForm';

export default function ChartsUsageDemo({
  componentName,
  childrenAccepted = false,
  data,
  renderDemo,
  getCode,
}) {
  const initialProps = {};
  let demoProps = {};
  let codeBlockProps = {};
  data.forEach((p) => {
    demoProps[p.propName] = p.defaultValue;
    if (p.codeBlockDisplay) {
      initialProps[p.propName] = p.defaultValue;
    }
    if (!p.knob) {
      codeBlockProps[p.propName] = p.defaultValue;
    }
  });
  const [props, setProps] = React.useState(initialProps);
  demoProps = { ...demoProps, ...props };
  codeBlockProps = { ...props, ...codeBlockProps };
  data.forEach((p) => {
    if (p.codeBlockDisplay === false) {
      delete codeBlockProps[p.propName];
    }
  });
  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        '& .markdown-body pre': {
          margin: 0,
          borderRadius: 'md',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 999, minWidth: 0, p: 3 }}>
        <Box
          sx={{
            flexGrow: 1,
            m: 'auto',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {renderDemo(demoProps)}
        </Box>
        <BrandingProvider mode="dark">
          <HighlightedCode
            code={getCode({
              name: componentName,
              props: codeBlockProps,
              childrenAccepted,
            })}
            language="jsx"
            sx={{ display: { xs: 'none', md: 'block' } }}
          />
        </BrandingProvider>
      </Box>
      <DemoPropsForm data={data} componentName={componentName} onPropsChange={setProps} />
    </Box>
  );
}

ChartsUsageDemo.propTypes = {
  childrenAccepted: PropTypes.any,
  componentName: PropTypes.any,
  data: PropTypes.any,
  getCode: PropTypes.any,
  renderDemo: PropTypes.any,
};
