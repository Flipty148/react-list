import {Container, Stack, Typography} from '@mui/material';
import { Film } from '../types';
import FilmComponent from './FilmComponent';
import {TextField, Box} from "@mui/material";
import { useEffect, useState } from 'react';
import { ScrollButton } from './ScrollButton';

type Props = {
    films: Film[];
}

export default function FilmList({films}: Props) {
    const [filter, setFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const filterFilms = films.filter((film) => film.russian_name.toLowerCase().includes(debouncedFilter.toLowerCase())
                                    || film.original_name.toLowerCase().includes(debouncedFilter.toLowerCase()));

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedFilter(filter);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filter])
    return (
        <Box>
            <Container maxWidth={'sm'} sx={{mt: 2, width:'1200px'}}>
                <Typography variant="h5" component={'h3'} sx={{mb:2}}>Список фильмов</Typography>
                <TextField label="Поиск" variant="outlined" sx={{mb: 2, width:'100%'}}
                onChange={(e) => setFilter(e.target.value)}/>
                <Stack spacing={2}>
                    {filterFilms.length === 0 ? <Typography>Ничего не найдено</Typography> : filterFilms.map((film) => (
                        <FilmComponent key={film.id} film={film} />
                    ))}
                </Stack>
            </Container>
            <ScrollButton />
        </Box>
    )
}
