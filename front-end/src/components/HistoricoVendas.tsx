import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
  
} from '@mui/material';


const API_VENDAS_URL = 'http://localhost:8080/controllers/VendasController.php';

export default function HistoricoVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(API_VENDAS_URL);
        if (Array.isArray(response.data)) {
          setVendas(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico de vendas:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchVendas();
  }, []); 

  if (loading) {
    return (
      <>
      
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
    
      </>
    );
  }

  return (
    <>
     
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
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Quantidade</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data da Venda</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Valor Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendas.map((venda) => (
                <TableRow key={venda.ID}>
                  <TableCell component="th" scope="row">
                    {venda.ID}
                  </TableCell>
                  <TableCell>
                    {venda.ID_produto} 
                  </TableCell>
                  <TableCell align="center">
                    {venda.quantidade}
                  </TableCell>
                  <TableCell>
                    {new Date(venda.data_venda).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(venda.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      
    </>
  );
}