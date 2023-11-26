import {Container, Stack, Typography, ThemeProvider, createTheme} from '@mui/material';
import { Film } from '../types';
import FilmComponent from './FilmComponent';
import {TextField} from "@mui/material";
import { useState } from 'react';

type Props = {
    films: Film[];
}

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

export default function FilmList({films}: Props) {
    const [filter, setFilter] = useState('');
    const filterFilms = films.filter((film) => film.russian_name.toLowerCase().includes(filter.toLowerCase())
                                    || film.original_name.toLowerCase().includes(filter.toLowerCase()));
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth={'sm'} sx={{mt: 2}}>
                <Typography variant="h5" component={'h3'} sx={{mb:2}}>Список фильмов</Typography>
                <TextField label="Поиск" variant="outlined" sx={{mb: 2, width:'100%'}}
                onChange={(e) => setFilter(e.target.value)}/>
                <Stack spacing={2}>
                    {filterFilms.map((film) => (
                        <FilmComponent key={film.id} film={film} />
                    ))}
                </Stack>
            </Container>
        </ThemeProvider>
    )
}
