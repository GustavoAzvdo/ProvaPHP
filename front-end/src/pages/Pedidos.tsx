
import { Typography, Paper, Container } from '@mui/material';

export default function Pedidos() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Página de Pedidos
        </Typography>
        <Typography>
          Aqui você pode gerenciar todos os pedidos dos clientes.
        </Typography>
        {/* Adicione aqui tabelas, formulários, etc. */}
      </Paper>
    </Container>
  );
}