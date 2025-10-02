import { GitHub } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography, Tooltip } from '@mui/material'

interface FooterProps {
    mini?: boolean;
}

const Footer = ({ mini = false }: FooterProps) => {
    if (mini) {
        return (
            <Box sx={{
                p: 1,
                mt: 'auto',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                width: '84px'
            }}
                
            >
                <Tooltip title="Gustavo Azevedo" placement="right">
                    <IconButton
                        component="a"
                        href="https://github.com/GustavoAzvdo"
                        target="_blank"
                        size="small"
                        sx={{ color: 'white', p: 0.5 }}
                    >
                        <GitHub sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="Jhonathan William" placement="right">
                    <IconButton
                        component="a"
                        href="https://github.com/Jhonathan-Will"
                        target="_blank"
                        size="small"
                        sx={{ color: 'white', p: 0.5 }}
                    >
                        <GitHub sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
                
                <Typography variant="caption" color="white" sx={{ fontSize: '0.6rem', textAlign: 'center', mt: 0.5 }}>
                    ©2025
                </Typography>
            </Box>
        )
    }

    //normal expandida
    return (
        <Box sx={{
            p: 2,
            mt: 'auto',
            bgcolor: 'primary.main',
            color: 'white'
        }}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" fontWeight={500} color="white">
                        Gustavo Azevedo
                    </Typography>
                    <IconButton
                        component="a"
                        href="https://github.com/GustavoAzvdo"
                        target="_blank"
                        size="small"
                        sx={{ color: 'white', p: 0.5 }}
                    >
                        <GitHub sx={{ fontSize: 16 }} />
                    </IconButton>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" fontWeight={500} color="white">
                        Jhonathan William
                    </Typography>
                    <IconButton
                        component="a"
                        href="https://github.com/Jhonathan-Will"
                        target="_blank"
                        size="small"
                        sx={{ color: 'white', p: 0.5 }}
                    >
                        <GitHub sx={{ fontSize: 16 }} />
                    </IconButton>
                </Stack>
                
                <Typography variant="caption" color="white" textAlign="center" sx={{ mt: 1 }}>
                    © 2025 Todos os direitos reservados
                </Typography>
            </Stack>
        </Box>
    )
}

export default Footer