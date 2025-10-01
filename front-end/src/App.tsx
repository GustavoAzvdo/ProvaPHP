
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import Dashboard from './pages/Dashboard';


function App() {
  


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <Routes>
         
          <Route path="/" element={ <Dashboard />  }/>
         
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;