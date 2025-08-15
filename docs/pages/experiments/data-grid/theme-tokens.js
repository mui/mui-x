import * as React from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DemoPageThemeProvider } from 'docs/src/theming';
import RichMarkdownElement from 'docs/src/modules/components/RichMarkdownElement';
import DataGridThemeVisualizer from 'docsx/src/modules/experiments/DataGridThemeVisualizer';
import * as pageProps from './theme-mapping.md?muiMarkdown';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`theme-tabpanel-${index}`}
      aria-labelledby={`theme-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `theme-tab-${index}`,
    'aria-controls': `theme-tabpanel-${index}`,
  };
}

export default function Page() {
  const { demos = {}, docs, demoComponents, srcComponents } = pageProps;
  const localizedDoc = docs.en;
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <DemoPageThemeProvider>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="theme customization tabs"
            sx={{ justifyContent: 'center' }}
          >
            <Tab label="Docs" {...a11yProps(0)} />
            <Tab label="Visualizer" {...a11yProps(1)} />
          </Tabs>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <TabPanel value={value} index={0} sx={{ '& code': { whiteSpace: 'nowrap' }, p: 3 }}>
          {localizedDoc.rendered.map((renderedMarkdownOrDemo, index) => (
            <RichMarkdownElement
              key={`demos-section-${index}`}
              demoComponents={demoComponents}
              demos={demos}
              disableAd
              localizedDoc={localizedDoc}
              renderedMarkdownOrDemo={renderedMarkdownOrDemo}
              srcComponents={srcComponents}
            />
          ))}
        </TabPanel>
      </Container>
      <TabPanel value={value} index={1}>
        <DataGridThemeVisualizer />
      </TabPanel>
    </DemoPageThemeProvider>
  );
}
