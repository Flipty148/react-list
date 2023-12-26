import './App.css'
import {root} from './main.tsx'
import Home from './pages/Home';
import Edit from './pages/Edit';
import Login from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Film } from './types';
import NavBar from './components/NavBar';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { isLogin } from './helpers/isLogin.ts';
import { useEffect, useState } from 'react';


//---------- Визуал ----------

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{display:'flex', flexDirection:'column', gap:2}}>
                <NavBar/>
                <Router />
            </Box>
        </ThemeProvider>
    )
}

window.addEventListener('hashchange', () => root.render(<App />));

function Router() {
    const isAuth = isLogin();
    const location = window.location;
    if (location.pathname === '/')
    {
        const hash = window.location.hash;
        if (hash === '') 
            return (<Home />)
        else if (/^#\/film\/[a-zA-Z0-9-]+\/edit/.test(hash)) {
            const match = hash.match(/^#\/film\/([a-zA-Z0-9-]+)\/edit/);
            const id = match ? match[1] : null;
            const film = getFilmById(String(id));
            if (!film) return (<NotFound />)
            else return (<Edit film={film} />)
        }
        else return (<NotFound />)
    }
    if (location.pathname === '/users/login' && !isAuth) return (<Login />)
    else {history.pushState(null, null, '/'); return (<Home />);}
    return (<NotFound />)
}

function getFilmById(id: string) {
    // const films = localStorage.getItem('films')
    // if (!films) return null
    // const json = JSON.parse(films)
    // return json.find((film:Film) => film.id === id)
    const [film, setFilm] = useState<Film>(null);

    useEffect(()=>{
    fetch(`http://localhost:3000/films/${id}`, {
        method: 'GET',
        credentials: 'include',
    })
    .then((resposne) => {if (resposne.ok) return resposne.json()})
    .then((json) => {
        if (!json) return null
        const res = {
            id: json.id,
            original_name: json.original_name,
            russian_name: json.russian_name,
            year: json.year,
            actors: json.actors
        }
        setFilm(res);
    })
    .catch((error) => console.log(error));
}, [id]);
    console.log(film);
    return film;
}

export default App
