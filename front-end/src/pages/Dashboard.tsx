import { createTheme } from '@mui/material/styles';

import { AppProvider, type Navigation, type Router } from '@toolpad/core/AppProvider';
import { DashboardLayout, type SidebarFooterProps } from '@toolpad/core';
import { DemoProvider, } from '@toolpad/core/internal';
import { PageContainer } from '@toolpad/core/PageContainer';

import ListaProdutos from '../components/ListaProdutos';
import HistoricoVendas from '../components/HistoricoVendas';
import React from 'react';
import { History, ShoppingBag, Store } from '@mui/icons-material';
import { Box,  Typography } from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Opções',
    },
    {
        segment: 'lista',
        title: 'Produtos',
        icon: <ShoppingBag />,
    },
    {
        segment: 'vendas',
        title: 'Vendas',
        icon: <History />,
    }
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function useDemoRouter(initialPath: string): Router {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path: string | URL) => {
                setPathname(String(path));
            },
        };
    }, [pathname]);

    return router;
}

function renderContent(pathname: string, _router: Router) {
    switch (pathname) {
        case '/lista':
            return <ListaProdutos />
        case '/vendas':
            return <HistoricoVendas />
        default:
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    textAlign: 'center'
                }}>
                    <Store sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Bem-vindo ao Sistema
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Selecione uma opção no menu lateral para começar
                    </Typography>
                </Box>
            )
    }
}

// Footer simples para a sidebar
function SidebarFooter({mini }: SidebarFooterProps) {
    return (
       <Footer mini={mini}/>
    );
}

interface DemoProps {
    window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <DemoProvider window={demoWindow}>
            <AppProvider
                navigation={NAVIGATION}
                router={router}
                theme={demoTheme}
                window={demoWindow}
                branding={{
                    logo: (
                       <Header/>
                    ),
                    title: 'Sistema de Produtos',
                }}
            >
                <DashboardLayout
                    slots={{
                        sidebarFooter: SidebarFooter,
                    }}
                >
                    <PageContainer>
                        {renderContent(router.pathname, router)}
                    </PageContainer>
                </DashboardLayout>
            </AppProvider>
        </DemoProvider>
    );
}