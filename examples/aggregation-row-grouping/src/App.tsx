import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import EmployeeDataGrid from './components/EmployeeDataGrid';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmployeeDataGrid />
      </Container>
    </React.Fragment>
  );
}

export default App;
