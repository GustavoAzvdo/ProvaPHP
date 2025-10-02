import  { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    
} from '@mui/material';
import { 
    BarChart,
    PieChart,
    LineChart
} from '@mui/x-charts';
import axios from 'axios';
import { 
    TrendingUp, 
    Inventory, 
    ShoppingCart, 
    AttachMoney,
    Warning
} from '@mui/icons-material';

const API_PRODUTOS_URL = 'http://localhost:8080/controllers/ProdutosController.php';
const API_VENDAS_URL = 'http://localhost:8080/controllers/VendasController.php';

interface Produto {
    ID: number;
    nome: string;
    valor: number;
    estoque: number;
}

interface Venda {
    ID: number;
    ID_produto: number;
    quantidade: number;
    valor_total: number;
    data_venda: string;
}

const Análise = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [produtosResponse, vendasResponse] = await Promise.all([
                    axios.get(API_PRODUTOS_URL),
                    axios.get(API_VENDAS_URL)
                ]);

                if (Array.isArray(produtosResponse.data)) {
                    setProdutos(produtosResponse.data);
                }
                if (Array.isArray(vendasResponse.data)) {
                    setVendas(vendasResponse.data);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Análises dos dados
    const totalProdutos = produtos.length;
    const totalVendas = vendas.length;
    const valorTotalVendas = vendas.reduce((acc, venda) => acc + parseFloat(String(venda.valor_total)), 0);
    const produtosSemEstoque = produtos.filter(produto => produto.estoque === 0).length;

    // Produto mais vendido
    const vendasPorProduto = vendas.reduce((acc, venda) => {
        acc[venda.ID_produto] = (acc[venda.ID_produto] || 0) + venda.quantidade;
        return acc;
    }, {} as Record<number, number>);

    const produtoMaisVendido = produtos.find(produto => 
        produto.ID === parseInt(Object.keys(vendasPorProduto).reduce((a, b) => 
            vendasPorProduto[parseInt(a)] > vendasPorProduto[parseInt(b)] ? a : b, '0'
        ))
    );

    // Dados para gráfico de barras - Top 5 produtos mais vendidos
    const dadosVendasPorProduto = produtos
        .map(produto => ({
            nome: produto.nome,
            quantidadeVendida: vendasPorProduto[produto.ID] || 0,
            valor: produto.valor
        }))
        .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
        .slice(0, 5);

    const xAxisData = dadosVendasPorProduto.map(item => item.nome);
    const seriesData = dadosVendasPorProduto.map(item => item.quantidadeVendida);

    // Dados para gráfico de pizza - Distribuição de estoque
    const dadosEstoque = [
        { id: 0, value: produtos.filter(p => p.estoque > 0).length, label: 'Em Estoque' },
        { id: 1, value: produtosSemEstoque, label: 'Sem Estoque' }
    ];

    // Dados para gráfico de linha - Vendas por dia
    const vendasPorDia = vendas.reduce((acc, venda) => {
        const data = new Date(venda.data_venda).toLocaleDateString('pt-BR');
        acc[data] = (acc[data] || 0) + parseFloat(String(venda.valor_total));
        return acc;
    }, {} as Record<string, number>);

    const dadosVendasPorDia = Object.entries(vendasPorDia)
        .map(([data, valor]) => ({ data, valor }))
        .sort((a, b) => new Date(a.data.split('/').reverse().join('/')).getTime() - 
                      new Date(b.data.split('/').reverse().join('/')).getTime());

    const xAxisDataLine = dadosVendasPorDia.map(item => new Date(item.data.split('/').reverse().join('/')));
    const seriesDataLine = dadosVendasPorDia.map(item => item.valor);

    // Produtos com baixo estoque (menos de 5 unidades)
    const produtosBaixoEstoque = produtos.filter(produto => produto.estoque > 0 && produto.estoque < 5);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
                Análise de Vendas e Estoque
            </Typography>

            {/* Cards com métricas principais */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
             <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Inventory color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total de Produtos</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {totalProdutos}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingCart color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total de Vendas</Typography>
                            </Box>
                            <Typography variant="h4" color="success.main">
                                {totalVendas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                 <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AttachMoney color="info" sx={{ mr: 1 }} />
                                <Typography variant="h6">Valor Total</Typography>
                            </Box>
                            <Typography variant="h4" color="info.main">
                                {valorTotalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Warning color="error" sx={{ mr: 1 }} />
                                <Typography variant="h6">Sem Estoque</Typography>
                            </Box>
                            <Typography variant="h4" color="error.main">
                                {produtosSemEstoque}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Gráfico de Barras - Produtos mais vendidos */}
              <Grid size={{xs: 12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Top 5 Produtos mais vendidos
                            </Typography>
                            <BarChart
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    data: xAxisData,
                                    tickLabelStyle: {
                                        angle: -45,
                                        textAnchor: 'end'
                                    }
                                }]}
                                series={[{ 
                                    data: seriesData,
                                    label: 'Quantidade Vendida',
                                    color: '#1976d2'
                                }]}
                                width={500}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de Pizza - Distribuição de estoque */}
               <Grid size={{xs: 12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Distribuição de estoque
                            </Typography>
                            <PieChart
                                series={[{
                                    data: dadosEstoque,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                }]}
                                width={500}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de Linha - Vendas por dia */}
            {dadosVendasPorDia.length > 0 && (
                 <Grid size={{xs: 12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Evolução de vendas por dia
                            </Typography>
                            <LineChart
                                xAxis={[{ 
                                    data: xAxisDataLine,
                                    scaleType: 'time',
                                    valueFormatter: (date) => date.toLocaleDateString('pt-BR')
                                }]}
                                series={[{
                                    data: seriesDataLine,
                                    label: 'Valor Total (R$)',
                                    color: '#388e3c',
                                    curve: 'linear'
                                }]}
                                width={1000}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            )}

            <Grid container spacing={3}>
                {/* Produto mais vendido */}
                  <Grid size={{xs: 12, md: 6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <TrendingUp sx={{ mr: 1 }} />
                                Produto mais vendido
                            </Typography>
                            {produtoMaisVendido ? (
                                <Box>
                                    <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                                        {produtoMaisVendido.nome}
                                    </Typography>
                                    <Typography variant="body1">
                                        Quantidade vendida: {vendasPorProduto[produtoMaisVendido.ID]} unidades
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Preço: {produtoMaisVendido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography>Nenhuma venda registrada</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Produtos com baixo estoque */}
                <Grid size={{xs: 12, md: 6}} sx={{my: 2}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Warning sx={{ mr: 1 }} color="warning" />
                                Produtos com baixo estoque
                            </Typography>
                            {produtosBaixoEstoque.length > 0 ? (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produto</TableCell>
                                                <TableCell align="center">Estoque</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {produtosBaixoEstoque.map((produto) => (
                                                <TableRow key={produto.ID}>
                                                    <TableCell>{produto.nome}</TableCell>
                                                    <TableCell align="center">
                                                        <Typography 
                                                            color={produto.estoque <= 2 ? 'error' : 'warning.main'}
                                                            fontWeight="bold"
                                                        >
                                                            {produto.estoque}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography color="success.main">
                                    Todos os produtos têm estoque adequado!
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Análise;