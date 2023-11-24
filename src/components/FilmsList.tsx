import {Container, Stack, Typography, ThemeProvider, createTheme} from '@mui/material';
import { Film } from '../types';
import FilmComponent from './FilmComponent';

type Props = {
    films: Film[];
}

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

export default function FilmList({films}: Props) {
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth={'sm'}>
                <Typography variant="h5" component={'h3'} sx={{mb:2}}>Список фильмов</Typography>
                <Stack spacing={2}>
                    {films.map((film) => (
                        <FilmComponent key={film.id} film={film} />
                    ))}
                </Stack>
            </Container>
        </ThemeProvider>
    )
}
