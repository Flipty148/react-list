import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton, Modal, Box, Typography, Button} from "@mui/material";
import { useState } from 'react';
import { Film } from '../types';
import useSetFilms from '../hooks/useSetFilms';

type Props = {
    film: Film
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function DeleteFilm({film}:Props) {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const setFilms = useSetFilms();

    return (
        <Box sx={{ml:'auto', mt:'auto', mb:'auto'}}>
            <IconButton sx={{color: 'red'}} onClick={handleOpen}>
                <DeleteIcon />
            </IconButton>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant='h6' component={'h6'}>Вы действительно хотите удалить фильм: "{film.russian_name + ' (' + film.original_name + ')'}"?</Typography>
                    <Box sx={{mt:2, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Button variant='contained' color='error' onClick={
                            e => {
                                e.preventDefault();
                                localStorage.setItem('films', JSON.stringify(JSON.parse(localStorage.getItem('films') as string).filter((f:Film) => f.id !== film.id)));
                                setFilms?.((prevFilms) => prevFilms.filter((f:Film) => f.id !== film.id));
                                handleClose();
                            }
                        }>Да</Button>
                        <Button variant='contained' color='success' onClick={handleClose}>Нет</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}
