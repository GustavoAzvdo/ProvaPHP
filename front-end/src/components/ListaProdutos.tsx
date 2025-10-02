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
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Footer from './Footer';
import Header from './Header';

const API_PRODUTOS_URL = 'http://localhost:8080/controllers/ProdutosController.php';
const API_VENDAS_URL = 'http://localhost:8080/controllers/VendasController.php';

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [quantidades, setQuantidades] = useState<{ [productId: number]: number }>({});
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        valor: '',
        estoque: ''
    });

    const fetchProdutos = async () => {
        try {
            const response = await axios.get(API_PRODUTOS_URL);
          
            if (Array.isArray(response.data)) {
                setProdutos(response.data);
            } else {
             
                console.error("A resposta da API não é um array! Resposta recebida:", response.data);
                setProdutos([]);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProdutos([]); 
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleQuantidadeChange = (productId: number, value: string) => {
        const quantity = parseInt(value, 10);
        if (quantity >= 0) {
            setQuantidades(prev => ({
                ...prev,
                [productId]: quantity,
            }));
        }
    };

    const comprarProduto = async (produto: any) => {
        const quantidade = quantidades[produto.ID] || 0;

        if (quantidade <= 0) {
            alert('Por favor, defina uma quantidade maior que zero.');
            return;
        }

        if (quantidade > produto.estoque) {
            alert(`Quantidade indisponível. Estoque atual: ${produto.estoque}`);
            return;
        }

        const novaVenda = {
            ID_produto: produto.ID,
            quantidade: quantidade,
            valor_total: produto.valor * quantidade,
            data_venda: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        try {
            const response = await axios.post(API_VENDAS_URL, novaVenda);
            alert(`Compra registrada com sucesso! ID da Venda: ${response.data.ID}`);
            setQuantidades(prev => ({ ...prev, [produto.ID]: 0 }));
            fetchProdutos();
        } catch (error) {
            console.error('Erro ao registrar a compra:', error);
            alert('Ocorreu um erro ao registrar a compra.');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setNovoProduto(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const adicionarProduto = async () => {
        if (!novoProduto.nome || !novoProduto.valor || !novoProduto.estoque) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            await axios.post(API_PRODUTOS_URL, {
                nome: novoProduto.nome,

                valor: parseFloat(novoProduto.valor),
                estoque: parseInt(novoProduto.estoque, 10)
            });
            alert('Produto adicionado com sucesso!');

            setNovoProduto({ nome: '', valor: '', estoque: '' });
            fetchProdutos();
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            alert("Falha ao adicionar o produto.");
        }
    };

    const excluirProduto = async (produtoId: number, nomeProduto: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o produto "${nomeProduto}"?`)) {
            try {
                await axios.delete(`${API_PRODUTOS_URL}?ID=${produtoId}`);
                alert('Produto excluído com sucesso!');
                fetchProdutos();
            } catch (error) {
                console.error("Erro ao excluir produto:", error);
                alert("Falha ao excluir o produto.");
            }
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon />
                            Adicionar Novo Produto
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Nome do Produto"
                                    variant="outlined"
                                    value={novoProduto.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    placeholder="Ex: Notebook Gamer"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Preço (R$)"
                                    type="number"
                                    variant="outlined"
                                    value={novoProduto.valor}
                                    onChange={(e) => handleInputChange('valor', e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{ inputProps: { min: 0, step: "0.01" } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Estoque"
                                    type="number"
                                    variant="outlined"
                                    value={novoProduto.estoque}
                                    onChange={(e) => handleInputChange('estoque', e.target.value)}
                                    placeholder="0"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={adicionarProduto}
                                    sx={{ height: '56px' }}
                                >
                                    Adicionar Produto
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                    Lista de Produtos
                </Typography>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Preço Unitário</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Estoque</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações de Compra</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow
                                    key={produto.ID}
                                    sx={{             
                                        ...(produto.estoque === 0 && {
                                            backgroundColor: '#f5f5f592',        
                                            '& > *': {
                                                color: '#757575',
                                            },
                                        }),
                                    }}
                                >
                                    <TableCell component="th" scope="row">{produto.ID}</TableCell>
                                    <TableCell component="th" scope="row">{produto.nome}</TableCell>
                                    <TableCell align="right">
                                        {parseFloat(produto.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell align="center">{produto.estoque}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                            <TextField
                                                label="Qtd."
                                                type="number"
                                                size="small"
                                                variant="outlined"
                                                value={quantidades[produto.ID] || ''}
                                                onChange={(e) => handleQuantidadeChange(produto.ID, e.target.value)}
                                                sx={{ width: '80px' }}
                                                InputProps={{ inputProps: { min: 0, max: produto.estoque } }}
                                                disabled={produto.estoque === 0}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => comprarProduto(produto)}
                                                disabled={produto.estoque === 0}
                                            >
                                                Comprar
                                            </Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="error"
                                            onClick={() => excluirProduto(produto.ID, produto.nome)}
                                            aria-label={`Excluir ${produto.nome}`}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Footer />
        </>
    );
}