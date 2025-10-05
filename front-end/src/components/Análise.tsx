import { useState, useEffect } from 'react';
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
    LineChart,
    ScatterChart
} from '@mui/x-charts';
import axios from 'axios';
import {
    TrendingUp,
    Inventory,
    ShoppingCart,
    AttachMoney,
    Warning,
    ListAlt,
    ScatterPlot
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


    const totalProdutos = produtos.length;
    const valorTotalVendas = vendas.reduce((aux, venda) => aux + parseFloat(String(venda.valor_total)), 0);
    const totalItensVendidos = vendas.reduce((aux, venda) => aux + venda.quantidade, 0); 
    const produtosSemEstoque = produtos.filter(produto => produto.estoque === 0).length;

    
    const vendasPorProduto = vendas.reduce((aux, venda) => {
        aux[venda.ID_produto] = (aux[venda.ID_produto] || 0) + venda.quantidade;
        return aux;
    }, {} as Record<number, number>);


    const valorVendidoPorProduto = vendas.reduce((aux, venda) => {
        aux[venda.ID_produto] = (aux[venda.ID_produto] || 0) + parseFloat(String(venda.valor_total));
        return aux;
    }, {} as Record<number, number>);

    const produtoMaisVendido = produtos.find(produto =>
        produto.ID === parseInt(Object.keys(vendasPorProduto).reduce((a, b) =>
            vendasPorProduto[parseInt(a)] > vendasPorProduto[parseInt(b)] ? a : b, '0'
        ))
    );

    const dadosVendasPorProduto = produtos
        .map(produto => ({
            nome: produto.nome,
            quantidadeVendida: vendasPorProduto[produto.ID] || 0,
            valorVendido: valorVendidoPorProduto[produto.ID] || 0,
            valor: produto.valor
        }))
        .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida);

    const top5Produtos = dadosVendasPorProduto.slice(0, 5);
    const xAxisData = top5Produtos.map(item => item.nome);
    const seriesData = top5Produtos.map(item => item.quantidadeVendida);

    // apenas 6 itens na pizza
    const dadosPizza = dadosVendasPorProduto
        .filter(produto => produto.valorVendido > 0)
        .slice(0, 6) 
        .map((produto, index) => ({
            id: index,
            value: produto.valorVendido,
            label: produto.nome
        }));

    // info grafico de linha
    const vendasPorDia = vendas.reduce((aux, venda) => {
        const data = new Date(venda.data_venda).toLocaleDateString('pt-BR');
        aux[data] = (aux[data] || 0) + parseFloat(String(venda.valor_total));
        return aux;
    }, {} as Record<string, number>);

    const dadosVendasPorDia = Object.entries(vendasPorDia)
        .map(([data, valor]) => ({ data, valor }))
        .sort((a, b) => new Date(a.data.split('/').reverse().join('/')).getTime() -
            new Date(b.data.split('/').reverse().join('/')).getTime());

    const xAxisDataLine = dadosVendasPorDia.map(item => new Date(item.data.split('/').reverse().join('/')));
    const seriesDataLine = dadosVendasPorDia.map(item => item.valor);

    const dadosDispersao = dadosVendasPorProduto
        .filter(produto => produto.quantidadeVendida > 0)
        .map(produto => ({
            x: produto.quantidadeVendida,
            y: produto.valor,
            id: produto.nome
        }));

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
           {/* cardss com infos */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingCart color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6">Itens Vendidos</Typography>
                            </Box>
                            <Typography variant="h4" color="success.main">
                                {totalItensVendidos}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            {/* os graficos começa aqui */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* barra */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Top 5 Produtos Mais Vendidos
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

                
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Distribuição de Valor por Produto
                            </Typography>
                            <PieChart
                                series={[{
                                    data: dadosPizza,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    valueFormatter: (value) => value.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }]}
                                width={400}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* dispersão */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <ScatterPlot sx={{ mr: 1 }} />
                                Preço vs Quantidade Vendida
                            </Typography>
                            <ScatterChart
                                width={500}
                                height={300}
                                series={[{
                                    data: dadosDispersao,
                                    label: 'Produtos',
                                    color: '#f57c00'
                                }]}
                                xAxis={[{
                                    label: 'Quantidade Vendida',
                                    min: 0
                                }]}
                                yAxis={[{
                                    label: 'Preço (R$)',
                                    min: 0,
                                    valueFormatter: (value: any) => `R$ ${value.toFixed(2)}`
                                }]}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* mais */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <ListAlt sx={{ mr: 1 }} />
                                Classificação Completa
                            </Typography>
                            <TableContainer sx={{ maxHeight: 300 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="center">Qtd Vendida</TableCell>
                                            <TableCell align="right">Valor Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dadosVendasPorProduto
                                            .filter(produto => produto.quantidadeVendida > 0)
                                            .map((produto, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Typography
                                                            fontWeight="bold"
                                                            color={index < 3 ? 'primary' : 'text.primary'}
                                                        >
                                                            {index + 1}º
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{produto.nome}</TableCell>
                                                    <TableCell align="center">
                                                        <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                                                            {produto.quantidadeVendida}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography
                                                            fontWeight={index < 3 ? 'bold' : 'normal'}
                                                            color={index < 3 ? 'success.main' : 'text.primary'}
                                                        >
                                                            {produto.valorVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* grafico de linha */}
            {dadosVendasPorDia.length > 0 && (
                <Grid size={{ xs: 12 }} sx={{ mb: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Evolução de Vendas por Dia
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
                {/* item mais vendido */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <TrendingUp sx={{ mr: 1 }} />
                                Produto Mais Vendido
                            </Typography>
                            {produtoMaisVendido ? (
                                <Box>
                                    <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                                        {produtoMaisVendido.nome}
                                    </Typography>
                                    <Typography variant="body1">
                                        Quantidade vendida: {vendasPorProduto[produtoMaisVendido.ID]} unidades
                                    </Typography>
                                    <Typography variant="body1">
                                        Valor total: {valorVendidoPorProduto[produtoMaisVendido.ID]?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Preço unitário: {produtoMaisVendido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography>Nenhuma venda registrada</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* estoque baixo */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Warning sx={{ mr: 1 }} color="warning" />
                                Produtos com Baixo Estoque
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