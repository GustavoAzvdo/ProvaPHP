import { GitHub, People } from '@mui/icons-material'
import { Box, Container, Divider, IconButton, Stack, Typography } from '@mui/material'

const Footer = () => {
    return (
        <Box sx={{
            mt: 10,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container sx={{
                py: 5,
                color: 'text.secondary'
            }}>
                <Stack direction={'row'} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: ' center' }}>
                    <People fontSize='large' sx={{ mx: 1 }} />
                    <Typography variant='h5' fontWeight={'600'}>
                        Desenvolvido por :
                    </Typography>

                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Stack direction={'column'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h6'>
                            Gustavo Azevedo
                        </Typography>
                        <IconButton
                            component="a"
                            href="https://github.com/GustavoAzvdo" 
                            target="_blank"
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}
                        >
                            <GitHub />
                        </IconButton>
                    </Stack>
                    <Stack direction={'column'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h6' >
                            Jhonathan William
                        </Typography>
                        <IconButton
                            component='a'
                            href='https://github.com/Jhonathan-Will'
                            target='_blank'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}
                        >
                            <GitHub />
                        </IconButton>
                    </Stack>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Divider />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ py: 2 }}>
                        Todos os direitos reservados © 2025
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer