import { createTheme } from '@mui/material/styles';

import { AppProvider, type Navigation, type Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, } from '@toolpad/core/internal';
import { PageContainer } from '@toolpad/core/PageContainer';


import ListaProdutos from '../components/ListaProdutos';
import HistoricoVendas from '../components/HistoricoVendas';
import React from 'react';
import { History, LocalMall, ShoppingBag } from '@mui/icons-material';
import { Box,  Chip } from '@mui/material';
const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Opções',
    },
    // se quiser adicionar mais, coloque o segment e o title e icon

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
    // se quiser adicionar mais paginas, só adicionar outro case /o_local_que_deseja
    switch (pathname) {
        case '/lista':
            return (
                <ListaProdutos />
            )
        case '/vendas':
            return (
                <HistoricoVendas />
            )

    }
}


interface DemoProps {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    // Remove this const when copying and pasting into your project.
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        // Remove this provider when copying and pasting into your project.
        <DemoProvider window={demoWindow}>
            {/* preview-start */}
            <AppProvider
                navigation={NAVIGATION}
                router={router}
                theme={demoTheme}
                window={demoWindow}
                branding={{
                    logo: <Box sx={{display: 'flex', alignItems:' center', justifyContent: 'center'}}>
                        <Chip
                        sx={{
                            px: 1,
                            mx: 1
                        }}
                            color='success'
                            label='BETA'
                        />
                        <LocalMall sx={{color: 'primary.main'}}/>
                    </Box>,
                    title: 'Cadastro e Histórico de Produtos' 
                    
                }}
            >
                <DashboardLayout>
                    <PageContainer>
                        {renderContent(router.pathname, router)}
                    </PageContainer>
                </DashboardLayout>
            </AppProvider>
            {/* preview-end */}
        </DemoProvider>
    );
}
