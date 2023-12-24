import { Container, Typography, Box, Button, TextField } from "@mui/material";
import {useState} from 'react';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    function handleSubmit(event: any) {
            event.preventDefault();
            console.log("handle");
            if (email && password) {
                fetch('http://localhost:3000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                    credentials: 'include',
                })
                .then((resposne) => {
                    if (resposne.ok) {
                        window.location.href = '/';
                    }
                }
                )
                .catch((error) => console.log(error));
            }

    }
    
    return (
        <Container sx={{maxWidth:'sm', mt: 2, width:'1200px'}}>
            <Typography variant='h5' component={'h5'} sx={{mb:2}}>Вход</Typography>
            <Box component={"form"}  method="POST" onSubmit={handleSubmit}>
                <TextField label="Почта" variant="outlined" sx={{mb: 2, width:'100%'}} name="email" onChange={(e)=> setEmail(e.target.value)}/>
                <TextField label="Пароль" variant="outlined" sx={{mb: 2, width:'100%'}} name="password" onChange={(e)=> setPassword(e.target.value)}/>
                <Button variant="contained" type="submit" sx={{mb: 2, width:'100%'}}>Войти</Button>
            </Box>
        </Container>
    )
}
