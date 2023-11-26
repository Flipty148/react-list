import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Box } from '@mui/material';
import { Film } from '../types';

type Props = {
    film: Film
}

export default function EditFilm({film}:Props) {
    return (
        <Box sx={{mt:'auto', mb:'auto'}}>
            <IconButton sx={{color: 'blue'}} onClick={() => {
                window.location.hash = `#/film/${film.id}/edit`
            }}>
                <EditIcon />
            </IconButton>
        </Box>
    )
}
