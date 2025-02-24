import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import { BrandingProvider } from '@mui/docs/branding';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import DemoPropsForm, { DataType, PropsFromData } from './DemoPropsForm';

export type ChartsUsageDemoProps<Data extends Record<string, DataType>, Props> = {
  componentName: string;
  childrenAccepted?: boolean;
  data: Data;
  renderDemo: (props: Props, setProps: (props: Props) => void) => React.ReactNode;
  getCode: (props: { name: string; props: Props; childrenAccepted: boolean }) => string;
};

export default function ChartsUsageDemo<
  Data extends Record<string, DataType>,
  Props extends PropsFromData<Data> = PropsFromData<Data>,
>({
  componentName,
  childrenAccepted = false,
  data,
  renderDemo,
  getCode,
}: ChartsUsageDemoProps<Data, Props>) {
  const [props, setProps] = React.useState<Props>(
    Object.entries(data).reduce(
      (acc, [propName, value]) => ({ ...acc, [propName]: value.defaultValue }),
      {} as Props,
    ),
  );

  React.useEffect(() => {
    setProps(
      Object.entries(data).reduce(
        (acc, [propName, value]) => ({ ...acc, [propName]: value.defaultValue }),
        {} as Props,
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
              props,
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
