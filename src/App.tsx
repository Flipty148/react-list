import './App.css'
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import Edit from './pages/Edit';
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


const domNode = document.getElementById('root')
if (!domNode) throw new Error('Root element not found');
const root = createRoot(domNode);

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
    const hash = window.location.hash
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

function getFilmById(id: number) {
    const films = localStorage.getItem('films')
    if (!films) return null
    const json = JSON.parse(films)
    return json.find((film:Film) => film.id === id)
}

export default App
