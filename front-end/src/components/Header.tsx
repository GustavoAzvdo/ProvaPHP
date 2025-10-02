import Box from '@mui/material/Box';
import {  Store } from '@mui/icons-material';
import { Chip } from '@mui/material';

export default function Header() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      py: 0.5
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        borderRadius: 1,
        p: 1,
        minWidth: 40,
        height: 40
      }}>
        <Store sx={{
          color: 'white',
          fontSize: 24
        }} />
      </Box>
      <Chip
        size="small"
        variant="outlined"
        label="BETA"
        sx={{
          color: "primary.main",
          fontWeight: 'bold',
          fontSize: '0.75rem'
        }}
      />
    </Box>
  );
}
