import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const teste = [
  { id: '1', id_produto: '1', data: '2025-09-30', item: 'Mouse Fortrek', quantidade: '1x', valorTotal: 120 },
];

export default function HistoricoVendas() {
  return (
    <>
    <Header/>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Histórico de Vendas
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de histórico de vendas">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID da Venda</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ID do Produto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Quantidade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teste.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell component="th" scope="row">
                  {venda.id}
                </TableCell>
                <TableCell>
                  {venda.id_produto}
                </TableCell>
                <TableCell>
                  {new Date(venda.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </TableCell>
                <TableCell>
                  {venda.item}
                </TableCell>
                <TableCell align="center">
                  {venda.quantidade}
                </TableCell>
                <TableCell align="right">
                  {venda.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    <Footer/>
    </>
  );
}