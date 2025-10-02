import { GitHub } from '@mui/icons-material'
import { Box, Container, IconButton, Stack, Typography } from '@mui/material'

const Footer = () => {
    return (
        <Box sx={{
            mt: 'auto',
            bgcolor: 'primary.main',
            py: 3
        }}>
            <Container maxWidth="md">
                <Stack spacing={2} alignItems="center">
                    {/* Nomes dos desenvolvedores */}
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" color="white" fontWeight={500}>
                                Gustavo Azevedo
                            </Typography>
                            <IconButton
                                component="a"
                                href="https://github.com/GustavoAzvdo" 
                                target="_blank"
                                size="small"
                                sx={{ color: 'white' }}
                            >
                                <GitHub fontSize="small" />
                            </IconButton>
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" color="white" fontWeight={500}>
                                Jhonathan William
                            </Typography>
                            <IconButton
                                component="a"
                                href="https://github.com/Jhonathan-Will"
                                target="_blank"
                                size="small"
                                sx={{ color: 'white' }}
                            >
                                <GitHub fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>

                    {/* Copyright */}
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" textAlign="center">
                        © 2025 Todos os direitos reservados
                    </Typography>
                </Stack>
            </Container>
        </Box>
    )
}

export default Footer