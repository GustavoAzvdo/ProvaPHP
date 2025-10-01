import { useState } from 'react';
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

const produtos = [
    { id: 1, nome: 'Mouse Fortrek', descricao: 'Mouse RGB', preco: 120, estoque: 3 },
  
];


export default function ListaProdutos() {
    const [quantidades, setQuantidades] = useState<{ [productId: number]: number }>({});    
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        descricao: '',
        preco: '',
        estoque: ''
    });

    const quantidade = (productId: number, value: string) => {
        const quantity = parseInt(value, 10);
      
        if (quantity >= 0) {
            setQuantidades(prev => ({
                ...prev,
                [productId]: quantity,
            }));
        }
    };

    const comprarProduto = (produto: { id: any; nome: any; descricao?: string; preco: any; estoque?: number; }) => {
        const quantidade = quantidades[produto.id] || 0;
        if (quantidade > 0) {
            
            alert(`Compra simulada: ${quantidade}x ${produto.nome}`);
            console.log('Enviando para o backend:', {
                produtoId: produto.id,
                quantidade: quantidade,
                precoUnitario: produto.preco,
                total: produto.preco * quantidade,
            });
         
            setQuantidades(prev => ({ ...prev, [produto.id]: 0 }));
        } else {
            alert('Por favor, defina uma quantidade maior que zero.');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setNovoProduto(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const adicionarProduto = () => {
 
        if (!novoProduto.nome || !novoProduto.descricao || !novoProduto.preco || !novoProduto.estoque) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

       
        console.log('Adicionando produto:', {
            nome: novoProduto.nome,
            descricao: novoProduto.descricao,
            preco: parseFloat(novoProduto.preco),
            estoque: parseInt(novoProduto.estoque)
        });

        alert('Produto adicionado com sucesso!');
        
        setNovoProduto({
            nome: '',
            descricao: '',
            preco: '',
            estoque: ''
        });
    };

    const excluir = (produtoId: number, nomeProduto: string) => {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir o produto "${nomeProduto}"?`);
        if (confirmacao) {
            console.log('Excluindo produto com ID:', produtoId);
            alert('Produto excluído com sucesso!');
        }
    };

    return (
        <>
            <Header/>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
               
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon />
                            Adicionar Novo Produto
                        </Typography>
                        
                        <Grid container spacing={2}>
                             <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="Nome do Produto"
                                    variant="outlined"
                                    value={novoProduto.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    placeholder="Ex: Notebook Gamer"
                                />
                            </Grid>
                           <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    variant="outlined"
                                    value={novoProduto.descricao}
                                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    placeholder="Ex: i7 12ª Gen, RTX 4080, 32GB RAM"
                                />
                            </Grid>
                          <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="Preço (R$)"
                                    type="number"
                                    variant="outlined"
                                    value={novoProduto.preco}
                                    onChange={(e) => handleInputChange('preco', e.target.value)}
                                    placeholder="0,00"
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                            </Grid>
                           <Grid size={{xs: 12, md: 6}}>
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
                            <Grid size={{xs: 12, md: 12}}>
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

                {/* Tabela de produtos */}
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                    Lista de Produtos
                </Typography>
                
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Preço Unitário</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Estoque</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações de Compra</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow key={produto.id}>
                                    <TableCell component="th" scope="row">
                                        {produto.nome}
                                    </TableCell>
                                    <TableCell>{produto.descricao}</TableCell>
                                    <TableCell align="right">
                                        {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell align="center">{produto.estoque}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                            <TextField
                                                label="Qtd."
                                                type="number"
                                                size="small"
                                                variant="outlined"
                                                value={quantidades[produto.id] || ''}
                                                onChange={(e) => quantidade(produto.id, e.target.value)}
                                                sx={{ width: '80px' }}
                                                InputProps={{ inputProps: { min: 0, max: produto.estoque } }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => comprarProduto(produto)}
                                            >
                                                Comprar
                                            </Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="error"
                                            onClick={() => excluir(produto.id, produto.nome)}
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
            <Footer/>
        </>
    );
}