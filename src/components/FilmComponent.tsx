import { Film } from "../types";
import { Card, CardContent, Typography, Box } from '@mui/material'
import DeleteFilm from "./DeleteFilm";
import React from "react";
import EditFilm from "./EditFilm";

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
            <Box sx={{display:'flex', flexDirection:'row'}}>
                <CardContent>
                    <Typography sx={{textAlign:'start', fontStyle: 'italic', fontWeight:'bolder', fontSize:18}} variant="h5" component='h3'>{film.russian_name + ' (' + film.original_name + ')'}</Typography>
                    <Typography sx={{textAlign:'start', fontSize:12}} component='p' color='text.secondary'><span style={{fontWeight:'bold'}}>Год выхода: </span>{film.year}</Typography>
                    <Typography sx={{textAlign:'start', fontSize:12}} component='p' color='text.secondary'><span style={{fontWeight:'bold'}}>Актеры: </span>{film.actors}</Typography>
                </CardContent>
                <Box sx={{display:'flex', flexDirection:'column', ml:'auto'}}>
                    <DeleteFilm film={film} />
                    <EditFilm film={film} />
                </Box>
            </Box>
        </Card>
    );
}

const FilmComponent = React.memo(FilmComponentBase)

export default FilmComponent;
