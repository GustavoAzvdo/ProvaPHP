
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';


function App() {
  
  const isAuthenticated = true; // Mude para 'false' para testar a rota de login

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
         
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;