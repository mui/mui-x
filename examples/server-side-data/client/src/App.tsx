import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import EmployeeDataGrid from './components/EmployeeDataGrid';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmployeeDataGrid />
      </Container>
    </>
  );
}

export default App
