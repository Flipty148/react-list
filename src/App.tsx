import './App.css'
import {root} from './main.tsx'
import Home from './pages/Home';
import Edit from './pages/Edit';
import Login from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Film } from './types';
import NavBar from './components/NavBar';
import { Box, createTheme, ThemeProvider } from '@mui/material';


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
    const location = window.location;
    if (location.pathname === '/')
    {
        const hash = window.location.hash;
        if (hash === '') 
            return (<Home />)
        else if (/^#\/film\/\d+\/edit/.test(hash)) {
            const match = hash.match(/^#\/film\/(\d+)\/edit/);
            const id = match ? match[1] : null;
            const film = getFilmById(Number(id));
            if (!film) return (<NotFound />)
            else return (<Edit film={film} />)
        }
        else return (<NotFound />)
    }
    if (location.pathname === '/users/login') return (<Login />)
    return (<NotFound />)
}

function getFilmById(id: number) {
    const films = localStorage.getItem('films')
    if (!films) return null
    const json = JSON.parse(films)
    return json.find((film:Film) => film.id === id)
}

export default App
