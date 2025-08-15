import * as React from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useUserLanguage } from '@mui/docs/i18n';
import { DemoPageThemeProvider } from 'docs/src/theming';
import RichMarkdownElement from 'docs/src/modules/components/RichMarkdownElement';
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
  const userLanguage = useUserLanguage();
  const localizedDoc = docs[userLanguage] || docs.en;
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <DemoPageThemeProvider>
      <Container maxWidth="lg">
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
          <Tabs value={value} onChange={handleChange} aria-label="theme customization tabs">
            <Tab label="Docs" {...a11yProps(0)} />
            <Tab label="Visualizer" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0} sx={{ '& code': { whiteSpace: 'nowrap' } }}>
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

        <TabPanel value={value} index={1}>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <h2>Theme Visualizer</h2>
            <p>Interactive theme visualizer coming soon...</p>
            {/* Placeholder for future visualizer implementation */}
          </Box>
        </TabPanel>
      </Container>
    </DemoPageThemeProvider>
  );
}
