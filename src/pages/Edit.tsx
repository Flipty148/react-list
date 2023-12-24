import { Container, Typography, Box, Button, TextField } from "@mui/material"
import { Film } from "../types"
import { useEffect, useRef, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
    film: Film
}

export default function Edit({film}:Props) {
    const [films, setFilms] = useState<Film[]>([])
    useEffect(() => {
        const f = localStorage.getItem('films');
        if (f) {
            setFilms(JSON.parse(f))
        }
    }, [])

    const originalNameRef = useRef<HTMLInputElement>(null);
    const russianNameRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const actorsRef = useRef<HTMLInputElement>(null);
    return(
            <Container sx={{padding:0}}>
                <Typography variant='h5' component={'h5'}>Редактирование фильма: "{film.russian_name + ' (' + film.original_name + ')'}"</Typography>
                <Box component={'form'}
                onSubmit={e => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const originalName = formData.get('original-name') as string;
                    const russianName = formData.get('russian-name') as string;
                    const year = formData.get('year') as unknown as number;
                    const actors = formData.get('actors') as string;
                    if (originalName && russianName && year && actors) {
                        setFilms?.((prevFilms) => {
                            const res = prevFilms.map(f => {
                                if (f.id === film.id) {
                                    return {
                                        id: film.id,
                                        original_name: originalName,
                                        russian_name: russianName,
                                        year: year,
                                        actors: actors
                                    }
                                }
                                return f;
                            });
                            localStorage.setItem('films', JSON.stringify(res));
                            window.location.href = '/';
                            return res;
                        });
                }}}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2
                }}
                >
                    <TextField label='Русское название' variant='outlined' name='russian-name' inputRef={russianNameRef} defaultValue={film.russian_name}/>
                    <TextField label='Оригинальное название' variant='outlined' name='original-name' inputRef={originalNameRef} defaultValue={film.original_name}/>
                    <TextField label='Год' variant='outlined' name='year' inputRef={yearRef} type='number' defaultValue={film.year}/>
                    <TextField label='Актеры' variant='outlined' name='actors' inputRef={actorsRef} defaultValue={film.actors}/>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <Button type="button" variant='contained' color="error" onClick={() => window.history.back()}>Отменить <ArrowBackIcon /></Button>
                        <Button type='submit' variant='contained'>Сохранить</Button>
                    </Box>
                </Box>
            </Container>
    )
}

