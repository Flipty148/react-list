import {Box, Button, Container, TextField, Typography} from '@mui/material'
import useSetFilms from '../hooks/useSetFilms'
import { useRef } from 'react'


export default function AddFilm() {
    const setFilms = useSetFilms();
    const originalNameRef = useRef<HTMLInputElement>(null);
    const russianNameRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const actorsRef = useRef<HTMLInputElement>(null);
    return (
        <Container maxWidth={'sm'}>
            <Typography variant='h5' component={'h5'}>Добавить фильм</Typography>
            <Box component={'form'}
            onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const originalName = formData.get('original-name') as string;
                const russianName = formData.get('russian-name') as string;
                const year = formData.get('year') as unknown as number;
                const actors = formData.get('actors') as string;
                if (originalName && russianName && year && actors) {
                    if (originalNameRef.current) originalNameRef.current.value = '';
                    if (russianNameRef.current) russianNameRef.current.value = '';
                    if (yearRef.current) yearRef.current.value = '';
                    if (actorsRef.current) actorsRef.current.value = '';

                    // setFilms?.((prevFilms) => {
                    //     const res = [{
                    //         id: Math.max(...prevFilms.map(f => f.id)) + 1,
                    //         original_name: originalName,
                    //         russian_name: russianName,
                    //         year: year,
                    //         actors: actors
                    //     }, ...prevFilms];
                    //     localStorage.setItem('films', JSON.stringify(res));
                    //     return res;
                    // })
                    fetch('http://localhost:3000/films', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            original_name: originalName,
                            russian_name: russianName,
                            year: year,
                            actors: actors
                        }),
                        credentials: 'include',
                    })
                    .then((resposne) => {
                        if (resposne.ok) {
                            setFilms?.((prevFilms) => {
                                const res = [{
                                    id: Math.max(...prevFilms.map(f => f.id)) + 1,
                                    original_name: originalName,
                                    russian_name: russianName,
                                    year: year,
                                    actors: actors
                                }, ...prevFilms];
                                return res;
                            })
                        }
                    })
                    .catch((error) => console.log(error));
                }
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2
            }}>
                <TextField label='Русское название' variant='outlined' name='russian-name' inputRef={russianNameRef} />
                <TextField label='Оригинальное название' variant='outlined' name='original-name' inputRef={originalNameRef} />
                <TextField label='Год' variant='outlined' name='year' inputRef={yearRef} type='number'/>
                <TextField label='Актеры' variant='outlined' name='actors' inputRef={actorsRef} />
                <Button type='submit' variant='contained'>Добавить</Button>
            </Box>
        </Container>
    );
}
