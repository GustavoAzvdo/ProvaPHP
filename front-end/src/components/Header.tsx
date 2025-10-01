import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { LocalMallOutlined } from '@mui/icons-material';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de compra e histórico de produtos
          </Typography>
          <Button color="inherit"><LocalMallOutlined/></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
