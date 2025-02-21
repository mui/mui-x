import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import { BrandingProvider } from '@mui/docs/branding';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import DemoPropsForm, { DataType } from './DemoPropsForm';

export type ChartsUsageDemoProps<P extends string> = {
  componentName: string;
  childrenAccepted?: boolean;
  data: DataType<P>[];
  renderDemo: (
    props: Record<string, any>,
    setProps: (props: Record<string, any>) => void,
  ) => React.ReactNode;
  getCode: (props: { name: string; props: any; childrenAccepted: boolean }) => string;
};

export default function ChartsUsageDemo<P extends string>({
  componentName,
  childrenAccepted = false,
  data,
  renderDemo,
  getCode,
}: ChartsUsageDemoProps<P>) {
  const [props, setProps] = React.useState(
    data.reduce(
      (acc, { propName, defaultValue }) => {
        acc[propName] = defaultValue;
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  React.useEffect(() => {
    setProps(
      data.reduce(
        (acc, { propName, defaultValue }) => {
          acc[propName] = defaultValue;
          return acc;
        },
        {} as Record<string, any>,
      ),
    );
  }, [data]);

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
          {renderDemo(props, setProps)}
        </Box>
        <BrandingProvider mode="dark">
          <HighlightedCode
            code={getCode({
              name: componentName,
              props: Object.entries(props).reduce(
                (acc, [key, value]) => {
                  acc[key] = value;
                  return acc;
                },
                {} as Record<string, any>,
              ),
              childrenAccepted,
            })}
            language="jsx"
            sx={{ display: { xs: 'none', md: 'block' } }}
          />
        </BrandingProvider>
      </Box>
      <DemoPropsForm
        data={data}
        props={props}
        componentName={componentName}
        onPropsChange={setProps}
      />
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
