import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container, Paper, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';


export default function SignUp() {
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
        });
        // Aqui você adicionaria a lógica de criação de conta
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Cadastrar-se
                        </Typography>
                    </Stack>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={2} sx={{ py: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    variant='standard'
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Nome"
                                    autoFocus
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    variant='standard'
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Sobrenome"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    variant='standard'
                                    required
                                    fullWidth
                                    id="email"
                                    label="Endereço de Email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    variant='standard'
                                    required
                                    fullWidth
                                    name="password"
                                    label="Senha"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Cadastrar
                        </Button>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 2
                            }}
                        >
                            <Link component={RouterLink} to="/login" variant="body2">
                                {"Já tem uma conta? Entre"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}