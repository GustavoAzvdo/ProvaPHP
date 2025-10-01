
import { Avatar, Button, TextField,Link,  Box, Typography, Container, Paper, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { Face } from '@mui/icons-material';

export default function Login() {
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });


        // logica de autenticação
    };

    return (
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container
                maxWidth='xs'

                sx={{
                    flexDirection: 'column',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}

            >

                <Paper
                    sx={{
                        p: 2,
                    }}
                    elevation={3}
                >
                    <Stack
                        direction={'column'}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Face />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Entrar
                        </Typography>
                    </Stack>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant='standard'
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Endereço de Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant='standard'
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Entrar
                        </Button>


                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: ' center',
                                py: 2
                            }}
                        >
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {"Não tem uma conta? Cadastre-se"}
                            </Link>
                        </Box>

                    </Box>
                </Paper>

            </Container>

        </Box>
    );
}