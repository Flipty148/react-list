import { Film } from "../types";
import { Card, CardContent, Typography } from '@mui/material'
import useSetFilms from "../hooks/useSetFilms";
import React from "react";

type Props = {
    film : Film;
}

/**
 * Карточка фильма
 */
function FilmComponentBase({film} : Props) {
    // const setFilms = useSetFilms();
    const labelId = `list-label-${film.id}`;
    return (
        <Card id={labelId} sx={{minWidth:275}}>
            <CardContent>
                <Typography sx={{textAlign:'start', fontStyle: 'italic', fontWeight:'bolder', fontSize:18}} variant="h5" component='h3'>{film.russian_name + ' (' + film.original_name + ')'}</Typography>
                <Typography sx={{textAlign:'start', fontSize:12}} component='p' color='text.secondary'><span style={{fontWeight:'bold'}}>Год выхода: </span>{film.year}</Typography>
                <Typography sx={{textAlign:'start', fontSize:12}} component='p' color='text.secondary'><span style={{fontWeight:'bold'}}>Актеры: </span>{film.actors}</Typography>
            </CardContent>
        </Card>
    );
}

const FilmComponent = React.memo(FilmComponentBase)

export default FilmComponent;
